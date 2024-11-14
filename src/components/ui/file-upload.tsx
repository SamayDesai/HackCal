"use client";
import { useState } from "react";
import {
    Button,
  } from '@chakra-ui/react'

export default function FileUpload({ file, setFile }: any) {
  const [fileEnter, setFileEnter] = useState(false);
  return (
    <div className="container px-4 max-w-5xl mx-auto">
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setFileEnter(true);
          }}
          onDragLeave={(e) => {
            setFileEnter(false);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setFileEnter(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            if (e.dataTransfer.items) {
              [...e.dataTransfer.items].forEach((item, i) => {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) {
                    let blobUrl = URL.createObjectURL(file);
                    setFile(blobUrl);
                  }
                  console.log(`items file[${i}].name = ${file?.name}`);
                }
              });
            } else {
              [...e.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
              });
            }
          }}
          className={`${
            fileEnter ? "border-4" : "border-2"
          } mx-auto  bg-white flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center`}
        >
          <label
            htmlFor="file"
            className="h-full flex flex-col justify-center text-center"
          >
            Upload or Drop Your Image!
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => {
                console.log(e.target.files);
                let files = e.target.files;
                if (files && files[0]) {
                  if (files[0].type.startsWith('image/')) {
                    const fr = new FileReader();
                    fr.readAsDataURL(files[0]);

                    fr.onload = (ev) => {
                      const res = fr.result;
                      console.log(res)
                      setFile(res);
                    }
                    // let blobUrl = URL.createObjectURL(files[0]);
                    // console.log(files)
                  } else {
                    alert('Please select an image file');
                  }
                }
              }}

          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <object
            className="rounded-md w-full max-w-xs h-72"
            data={file}
            type="image/png" //need to be updated based on type of file
          />
          <Button
            onClick={() => setFile("")}
            className="px-4 mt-4 py-2"
            colorScheme="teal"
            variant="outline"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};
