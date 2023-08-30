'use client';

import React from 'react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { uploadApi } from '@/api/uploadApi';
import Robot from '../../../public/robot.gif';
import iconLoading from '../../../public/iconLoading.svg';
import { v4 as uuidv4 } from 'uuid';

interface IDropzoneProps {
  className: string;
}

export const Dropzone = ({ className }: IDropzoneProps) => {
  const [files, setFiles] = useState<any>([]);
  // const [rejected, setRejected] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outPut, setOutPut] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles: any) => [
        // If allowing multiple files
        // ...previousFiles,
        ...acceptedFiles.map((file: any) =>
          Object.assign(file, { preview: URL.createObjectURL(file) }),
        ),
      ]);
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result?.toString()?.split(',')[1] || '';
      setFileContent(base64Data);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (fileContent) {
          const payload = { base64Data: fileContent };
          const parsePayload = JSON.stringify(payload);

          const res = await uploadApi.postImage(parsePayload);
          setOutPut(res.data.imageBase64);
        }
      } catch (error) {
        console.log('error', error);
      }
      setIsLoading(false);
    })();
  }, [fileContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name: any) => {
    setFiles((files: any) => files.filter((file: any) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    // setRejected([]);
    setOutPut('');
    setFileContent('');
  };

  const handleDownloadFile = async () => {
    if (outPut) {
      try {
        const response = await fetch(`data:image/png;base64,${outPut}`);
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `output${uuidv4()}.png`;
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  return (
    <form>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps({ name: 'file' })} />
        <div className="flex flex-col items-center justify-center gap-4">
          <ArrowUpTrayIcon className="h-5 w-5 fill-current" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className="mt-10">
        <div className="flex gap-4">
          <h2 className="title text-3xl font-semibold">Preview</h2>
          <button
            type="button"
            onClick={removeAll}
            className="mt-1 rounded-md border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
          >
            Remove all files
          </button>
          <button
            type="button"
            onClick={handleDownloadFile}
            className="ml-auto mt-1 rounded-md border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white"
            disabled={outPut ? false : true}
          >
            Download file
          </button>
        </div>

        {/* Accepted files */}
        <h3 className="title mt-10 border-b pb-3 text-lg font-semibold text-stone-600">
          {/* Accepted Files */}
          Input file
        </h3>
        <div className="mt-6 flex text-center justify-center">
          {files.length > 0 ? (
            <ul
              className="mt-6"
              // grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            >
              {files.map((file: any) => (
                <li
                  key={file.name}
                  // className="relative h-32 rounded-md shadow-lg"
                  className="relative flex text-center justify-center"
                >
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={500}
                    height={500}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                    // className="h-full w-full rounded-md object-contain"
                  />
                  <button
                    type="button"
                    className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white"
                    onClick={() => {
                      setOutPut('');
                      removeFile(file.name);
                      setFileContent('');
                    }}
                  >
                    <XMarkIcon className="h-5 w-5 fill-white transition-colors hover:fill-rose-400" />
                  </button>
                  {/* <p className="mt-2 text-[12px] font-medium text-stone-500">{file.name}</p> */}
                </li>
              ))}
            </ul>
          ) : (
            <Image
              src={Robot}
              alt={'output'}
              width={100}
              height={100}
              className={outPut ? `h-full w-full rounded-md object-contain` : `w-[400px] h-[400px]`}
            />
          )}
        </div>

        {/* Output file */}
        <h3 className="title mt-24 border-b pb-3 text-lg font-semibold text-stone-600">
          Output file
        </h3>
        <div className="mt-6 flex text-center justify-center">
          {isLoading ? (
            <Image
              src={iconLoading}
              alt={'iconLoading'}
              width={150}
              height={150}
              className="bg-[#ffffff]"
            />
          ) : (
            <Image
              src={outPut ? `data:image/png;base64,${outPut}` : Robot}
              alt={'output'}
              width={100}
              height={100}
              className={outPut ? `h-full w-full rounded-md object-contain` : `w-[400px] h-[400px]`}
            />
          )}
        </div>
        {/* <ul className="mt-6 flex flex-col">
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className="flex items-start justify-between">
              <div>
                <p className="mt-2 text-sm font-medium text-stone-500">{file.name}</p>
                <ul className="text-[12px] text-red-400">
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul> */}
      </section>
    </form>
  );
};
