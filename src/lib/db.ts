import { writable } from "svelte/store";
import type { Sample } from "./types";

export const samples = writable<Sample[]>([]);

const initialFile = "";
const inMemorySamples: Map<string, Sample[]> = new Map();
inMemorySamples.set(initialFile, []);
inMemorySamples.set("abcde", []);
inMemorySamples.set("12345", []);

let selected = initialFile;
export const selectedFile = writable(initialFile);
export const fileList = writable([...inMemorySamples.keys()]);

const addSample = (sample: Sample) => {
  const data = inMemorySamples.get(selected);
  data.push(sample);
  samples.set(data);
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

const deleteFile = () => {
  if (selected === "") {
    // Ignore "scratch" file
    return;
  }
  if (inMemorySamples.has(selected)) {
    inMemorySamples.delete(selected);
    fileList.update(($fileList) => $fileList.filter((f) => f !== selected));
    setSelectedFile("");
  }
};

export default {
  addSample,
  setSelectedFile,
  clearFile,
  deleteFile,
  renameFile,
};
