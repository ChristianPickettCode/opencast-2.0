import fs from "fs";

export default function handler(req, res) {
  const { fileName } = req.body;
  console.log(fileName);
  const data = fs.readFileSync(`./public/uploads/${fileName}`);
  console.log(typeof data);
  res.status(200).json({ fileData: data });
}
