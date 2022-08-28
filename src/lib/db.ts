import { writable } from "svelte/store";
import type { Sample } from "./types";

export const samples = writable<Sample[]>([]);

const initialFile = "";
const inMemorySamples: Map<string, Sample[]> = new Map();
inMemorySamples.set(initialFile, []);

let selected = initialFile;
export const selectedFile = writable(initialFile);
export const fileList = writable([...inMemorySamples.keys()]);

// Database
const DB_NAME = "arduino-data";
const OBJSTORE_NAME = "samples";
let database: IDBDatabase;

const openDatabase = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME);
    openRequest.addEventListener("error", (e) => {
      reject(`Cannot open internal Database`);
    });
    openRequest.addEventListener("upgradeneeded", (e) => {
      console.log("Creating Database");
      const db = e.target["result"];
      const objStore = db.createObjectStore(OBJSTORE_NAME, {
        keyPath: "timestamp",
      });
      objStore.createIndex("file", "file");
    });
    openRequest.addEventListener("success", (e) => {
      const db = e.target["result"];
      resolve(db);
    });
  });
};

const saveSampleInDatabase = async (sample: Sample) => {
  return new Promise<void>((resolve, reject) => {
    console.log("saveSample", sample);
    const addRequest = database
      .transaction([OBJSTORE_NAME], "readwrite")
      .objectStore(OBJSTORE_NAME)
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

openDatabase().then((db) => {
  console.log("Database opened", db);
  database = db;
});

const fileContent = () => {
  const samples = inMemorySamples.get(selected);
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

const addSample = (sample: Sample) => {
  const data = inMemorySamples.get(selected);
  sample.file = selected;
  data.push(sample);
  samples.set(data);
  saveSampleInDatabase(sample);
};

const setSelectedFile = (name: string) => {
  if (inMemorySamples.has(name)) {
    samples.set(inMemorySamples.get(name));
  } else {
    inMemorySamples.set(name, []);
    samples.set([]);
    fileList.update(($fileList) => [...$fileList, name]);
  }
  selected = name;
  selectedFile.set(name);
};

const clearFile = () => {
  if (inMemorySamples.has(selected)) {
    inMemorySamples.set(selected, []);
    samples.set([]);
  }
};

const renameFile = (oldName: string, newName: string) => {
  if (inMemorySamples.has(oldName)) {
    const data = inMemorySamples.get(oldName);
    inMemorySamples.set(newName, data);
    inMemorySamples.delete(oldName);
    fileList.update(($fileList) => [
      ...$fileList.filter((f) => f !== oldName),
      newName,
    ]);
  }
};

let currentIndex = 1;
const newFile = () => {
  let newFileName;
  do {
    newFileName = `New File ${currentIndex}`;
    currentIndex++;
  } while (inMemorySamples.has(newFileName));
  inMemorySamples.set(newFileName, []);
  fileList.update(($fileList) => [...$fileList, newFileName]);
};

const deleteFile = () => {
  if (selected === "") {
    // Ignore "scratch" file
    return;
  }
  if (inMemorySamples.has(selected)) {
    inMemorySamples.delete(selected);
    let last;
    fileList.update(($fileList) => {
      const index = $fileList.indexOf(selected);
      const newFileList = $fileList.filter((f) => f !== selected);
      last = newFileList[index] || newFileList[newFileList.length - 1];
      return newFileList;
    });
    setSelectedFile(last);
  }
};

export default {
  fileContent,
  addSample,
  setSelectedFile,
  clearFile,
  newFile,
  deleteFile,
  renameFile,
};
