import { writable, type Writable } from "svelte/store";
import type { Sample } from "./types";

// Database
const DB_NAME = "arduino-data";
const SAMPLES_OBJSTORE_NAME = "samples";
const FILES_OBJSTORE_NAME = "files";
const FILE_INDEX_NAME = "file";
export const SCRATCH_FILENAME = "";

export const samples = writable<Sample[]>([]);

let database: IDBDatabase;
let filenames: Set<string>;
export let fileList: Writable<string[]> = writable([]);

const dbOpen = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME);
    openRequest.addEventListener("error", (e) => {
      reject(`Cannot open internal Database`);
    });
    openRequest.addEventListener("upgradeneeded", (e) => {
      console.log("Creating Database");
      const db = openRequest.result;
      db.createObjectStore(SAMPLES_OBJSTORE_NAME, {
        keyPath: "timestamp",
      }).createIndex(FILE_INDEX_NAME, "file");
      db.createObjectStore(FILES_OBJSTORE_NAME, { keyPath: "name" });
    });
    openRequest.addEventListener("success", (e) => {
      const db = e.target["result"];
      resolve(db);
    });
  });
};

const init = async () => {
  database = await dbOpen();
  console.log("Opened Database");
  const files = await dbFilesGetAll();
  filenames = new Set([SCRATCH_FILENAME, ...files]);
  fileList.set([...filenames.values()]);
  fileSelect(SCRATCH_FILENAME);
};

const dbSampleSave = async (sample: Sample) => {
  return new Promise<void>((resolve, reject) => {
    console.log("saveSample", sample);
    const addRequest = database
      .transaction([SAMPLES_OBJSTORE_NAME], "readwrite")
      .objectStore(SAMPLES_OBJSTORE_NAME)
      .add(sample);
    addRequest.addEventListener("error", (e) => {
      reject(`Cannot save sample`);
    });
    addRequest.addEventListener("success", (e) => {
      console.log("Sample saved");
      resolve();
    });
  });
};

const dbFilesGetAll = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const request = database
      .transaction([FILES_OBJSTORE_NAME], "readonly")
      .objectStore(FILES_OBJSTORE_NAME)
      .getAll();
    request.onerror = () => reject(`Can't read available files`);
    request.onsuccess = () => {
      resolve(request.result.map((file) => file.name));
    };
  });
};

const dbSamplesGetAll = async (file: string): Promise<Sample[]> => {
  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.only(file);
    const samples = [];
    const request = database
      .transaction([SAMPLES_OBJSTORE_NAME], "readonly")
      .objectStore(SAMPLES_OBJSTORE_NAME)
      .index(FILE_INDEX_NAME)
      .openCursor(range);
    request.onerror = (e) => {
      reject(`Couldn't get samples from "${file}"`);
    };
    request.onsuccess = (e) => {
      const cursor = request.result;
      if (cursor) {
        samples.push(cursor.value);
        cursor.continue();
      } else {
        resolve(samples);
      }
    };
  });
};

const dbSamplesDeleteAll = async (file: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.only(file);
    const objstore = database
      .transaction([SAMPLES_OBJSTORE_NAME], "readwrite")
      .objectStore(SAMPLES_OBJSTORE_NAME);
    const request = objstore.index(FILE_INDEX_NAME).openKeyCursor(range);
    request.onerror = () => reject();
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        objstore.delete(cursor.primaryKey);
        cursor.continue();
      } else {
        resolve();
      }
    };
  });
};

const dbSamplesMove = async (
  oldFile: string,
  newFile: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.only(oldFile);
    const objstore = database
      .transaction([SAMPLES_OBJSTORE_NAME], "readwrite")
      .objectStore(SAMPLES_OBJSTORE_NAME);
    const req1 = objstore.index(FILE_INDEX_NAME).openCursor(range);
    req1.onerror = () => reject();
    req1.onsuccess = () => {
      const cursor = req1.result;
      if (cursor) {
        const sample = cursor.value;
        sample.file = newFile;
        const req2 = objstore.put(sample);
        req2.onerror = () => reject();
        req2.onsuccess = () => cursor.continue();
      } else {
        resolve();
      }
    };
  });
};

const dbFilesAdd = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = database
      .transaction([FILES_OBJSTORE_NAME], "readwrite")
      .objectStore(FILES_OBJSTORE_NAME)
      .add({ name });
    request.onerror = () => reject();
    request.onsuccess = () => resolve();
  });
};

const dbFilesRemove = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = database
      .transaction([FILES_OBJSTORE_NAME], "readwrite")
      .objectStore(FILES_OBJSTORE_NAME)
      .delete(name);
    request.onerror = () => reject();
    request.onsuccess = () => resolve();
  });
};

let currentIndex = 1;
const generateFileName = (): string => {
  let newFileName;
  do {
    newFileName = `New File ${currentIndex}`;
    currentIndex++;
  } while (filenames.has(newFileName));
  return newFileName;
};

const fileNew = async () => {
  const name = generateFileName();
  await dbFilesAdd(name);
  filenames.add(name);
  fileList.set([...filenames.values()]);
  selected = name;
  selectedFile.set(selected);
  samples.set([]);
};

const fileDelete = async (): Promise<void> => {
  if (selected === SCRATCH_FILENAME) {
    return; // Ignore "scratch" file
  }
  await dbSamplesDeleteAll(selected);
  await dbFilesRemove(selected);
  filenames.delete(selected);
  fileList.update(($fileList) => {
    const index = $fileList.indexOf(selected);
    filenames.delete(selected);
    const newFileList = [...filenames.values()];
    selected = newFileList[index] || newFileList[newFileList.length - 1];
    return newFileList;
  });
  fileSelect(selected);
};

const fileContent = async () => {
  const samples = await dbSamplesGetAll(selected);
  const { values } = samples[0];
  const header = [
    "Timestamp",
    ...[...Array(values.length)].map((_, i) => `Col ${i + 1}`),
  ].join(";");
  const lines = samples.map(({ timestamp, values }) =>
    [Number(timestamp), ...values].join(";")
  );
  return [header, ...lines].join("\n");
};

const fileClear = async () => {
  await dbSamplesDeleteAll(selected);
  samples.set([]);
};

const fileRename = async (newName: string): Promise<void> => {
  await dbSamplesMove(selected, newName);
  filenames.delete(selected);
  await dbFilesRemove(selected);
  filenames.add(newName);
  await dbFilesAdd(newName);
  fileList.set([...filenames.values()]);
  selected = newName;
  selectedFile.set(selected);
};

let selected = SCRATCH_FILENAME;
export const selectedFile = writable(selected);

const fileSelect = async (name: string): Promise<void> => {
  samples.set(await dbSamplesGetAll(name));
  selected = name;
  selectedFile.set(name);
};

const addSample = async (sample: Sample) => {
  sample.file = selected; // Set the selected file for the index
  await dbSampleSave(sample);
  samples.update(($samples) => [...$samples, sample]);
};

init();

export default {
  fileNew,
  fileSelect,
  addSample,
  fileRename,
  fileClear,
  fileDelete,
  fileContent,
};
