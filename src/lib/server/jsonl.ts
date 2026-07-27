import "server-only";

import {
  access,
  appendFile,
  chmod,
  mkdir,
  open,
  rename,
  stat,
  unlink,
} from "node:fs/promises";
import { constants } from "node:fs";
import { basename, dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

const writeQueues = new Map<string, Promise<void>>();

export type JsonlAppendOptions = {
  maxFileBytes: number;
  rotationFiles: number;
};

const fileSize = async (path: string): Promise<number> => {
  try {
    return (await stat(path)).size;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return 0;
    }
    throw error;
  }
};

const rotateIfNeeded = async (
  path: string,
  incomingBytes: number,
  options: JsonlAppendOptions,
): Promise<void> => {
  const size = await fileSize(path);
  if (size === 0 || size + incomingBytes <= options.maxFileBytes) {
    return;
  }

  const oldest = `${path}.${options.rotationFiles}`;
  try {
    await unlink(oldest);
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }

  for (let index = options.rotationFiles - 1; index >= 1; index -= 1) {
    try {
      await rename(`${path}.${index}`, `${path}.${index + 1}`);
    } catch (error) {
      if (
        !error ||
        typeof error !== "object" ||
        !("code" in error) ||
        error.code !== "ENOENT"
      ) {
        throw error;
      }
    }
  }

  await rename(path, `${path}.1`);
};

const enqueueWrite = async (path: string, operation: () => Promise<void>) => {
  const previous = writeQueues.get(path) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(operation);
  writeQueues.set(path, current);

  try {
    await current;
  } finally {
    if (writeQueues.get(path) === current) {
      writeQueues.delete(path);
    }
  }
};

export const appendJsonLine = async (
  path: string,
  value: unknown,
  options: JsonlAppendOptions,
): Promise<void> => {
  const line = `${JSON.stringify(value)}\n`;
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes > options.maxFileBytes) {
    throw new Error("JSONL entry exceeds the configured file limit.");
  }

  await enqueueWrite(path, async () => {
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    await rotateIfNeeded(path, bytes, options);
    await appendFile(path, line, { encoding: "utf8", mode: 0o600 });
    await chmod(path, 0o600);
  });
};

export const verifyJsonlPathWritable = async (path: string): Promise<void> => {
  const directory = dirname(path);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  try {
    await access(path, constants.W_OK);
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }

  const probePath = join(
    directory,
    `.${basename(path)}.ready-${randomUUID()}.tmp`,
  );
  const handle = await open(probePath, "wx", 0o600);
  try {
    await handle.writeFile('{"ready":true}\n', { encoding: "utf8" });
    await handle.sync();
  } finally {
    await handle.close();
    await unlink(probePath).catch(() => undefined);
  }
};
