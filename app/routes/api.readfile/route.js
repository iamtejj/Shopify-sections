import { promises as fs } from 'fs';
import path from 'path';
import { json } from '@remix-run/node';

export const loader = async () => {
//   const filePath = path.join(__dirname, '', 'example.txt');
//   const fileContent = await fs.readFile(filePath, 'utf-8');
console.log("route hitting")
  return json({ content: "hire there" });
};
// export default function Myapp(){
//   return(
//     <>
//     Hello world
//     </>
//   )
// } 