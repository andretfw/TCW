import 'server-only';

import {deflateRawSync, inflateRawSync} from 'node:zlib';

interface ZipEntry {
  name: string;
  data: Buffer;
  compressionMethod: number;
  flags: number;
  modifiedTime: number;
  modifiedDate: number;
  internalAttributes: number;
  externalAttributes: number;
  versionMadeBy: number;
  versionNeeded: number;
}

const LOCAL_FILE_HEADER = 0x04034b50;
const CENTRAL_DIRECTORY_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const UTF8_FLAG = 0x0800;
const DATA_DESCRIPTOR_FLAG = 0x0008;

function findEndOfCentralDirectory(buffer: Buffer): number {
  const minimumOffset = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY) return offset;
  }
  throw new Error('The Word template is not a valid DOCX archive.');
}

function readZipEntries(buffer: Buffer): ZipEntry[] {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  const entries: ZipEntry[] = [];
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== CENTRAL_DIRECTORY_HEADER) {
      throw new Error('The Word template central directory is invalid.');
    }

    const versionMadeBy = buffer.readUInt16LE(offset + 4);
    const versionNeeded = buffer.readUInt16LE(offset + 6);
    const flags = buffer.readUInt16LE(offset + 8);
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const modifiedTime = buffer.readUInt16LE(offset + 12);
    const modifiedDate = buffer.readUInt16LE(offset + 14);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const internalAttributes = buffer.readUInt16LE(offset + 36);
    const externalAttributes = buffer.readUInt32LE(offset + 38);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const nameBytes = buffer.subarray(offset + 46, offset + 46 + fileNameLength);
    const name = nameBytes.toString((flags & UTF8_FLAG) !== 0 ? 'utf8' : 'latin1');

    if (buffer.readUInt32LE(localHeaderOffset) !== LOCAL_FILE_HEADER) {
      throw new Error(`The Word template entry ${name} has an invalid local header.`);
    }
    const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);

    let data: Buffer;
    if (compressionMethod === 0) data = Buffer.from(compressed);
    else if (compressionMethod === 8) data = inflateRawSync(compressed);
    else throw new Error(`Unsupported DOCX compression method ${compressionMethod}.`);

    entries.push({
      name,
      data,
      compressionMethod,
      flags,
      modifiedTime,
      modifiedDate,
      internalAttributes,
      externalAttributes,
      versionMadeBy,
      versionNeeded,
    });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) !== 0 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function writeZipEntries(entries: ZipEntry[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let localOffset = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.name, 'utf8');
    const method = entry.name.endsWith('/') ? 0 : entry.compressionMethod === 0 ? 0 : 8;
    const compressed = method === 8 ? deflateRawSync(entry.data, {level: 6}) : entry.data;
    const crc = crc32(entry.data);
    const flags = (entry.flags | UTF8_FLAG) & ~DATA_DESCRIPTOR_FLAG;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(LOCAL_FILE_HEADER, 0);
    localHeader.writeUInt16LE(Math.max(20, entry.versionNeeded), 4);
    localHeader.writeUInt16LE(flags, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(entry.modifiedTime, 10);
    localHeader.writeUInt16LE(entry.modifiedDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(entry.data.length, 22);
    localHeader.writeUInt16LE(nameBytes.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, nameBytes, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(CENTRAL_DIRECTORY_HEADER, 0);
    centralHeader.writeUInt16LE(entry.versionMadeBy || 20, 4);
    centralHeader.writeUInt16LE(Math.max(20, entry.versionNeeded), 6);
    centralHeader.writeUInt16LE(flags, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(entry.modifiedTime, 12);
    centralHeader.writeUInt16LE(entry.modifiedDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(entry.data.length, 24);
    centralHeader.writeUInt16LE(nameBytes.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(entry.internalAttributes, 36);
    centralHeader.writeUInt32LE(entry.externalAttributes, 38);
    centralHeader.writeUInt32LE(localOffset, 42);
    centralParts.push(centralHeader, nameBytes);

    localOffset += localHeader.length + nameBytes.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(END_OF_CENTRAL_DIRECTORY, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(localOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, eocd]);
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function fillDocxTemplate(
  template: Buffer,
  values: Record<string, string>,
): Buffer {
  const entries = readZipEntries(template);
  const replacementKeys = Object.keys(values);
  let replacements = 0;

  for (const entry of entries) {
    if (!entry.name.startsWith('word/') || !entry.name.endsWith('.xml')) continue;
    let xml = entry.data.toString('utf8');
    const original = xml;

    for (const key of replacementKeys) {
      const token = `{{${key}}}`;
      if (!xml.includes(token)) continue;
      const count = xml.split(token).length - 1;
      xml = xml.split(token).join(escapeXml(values[key] ?? ''));
      replacements += count;
    }

    if (xml !== original) entry.data = Buffer.from(xml, 'utf8');
  }

  if (replacements === 0) {
    throw new Error('The Word template did not contain any recognised contract placeholders.');
  }

  const unresolved = new Set<string>();
  for (const entry of entries) {
    if (!entry.name.startsWith('word/') || !entry.name.endsWith('.xml')) continue;
    const xml = entry.data.toString('utf8');
    for (const match of xml.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)) unresolved.add(match[1]);
  }
  if (unresolved.size > 0) {
    throw new Error(`The contract template still contains unresolved fields: ${[...unresolved].join(', ')}.`);
  }

  return writeZipEntries(entries);
}
