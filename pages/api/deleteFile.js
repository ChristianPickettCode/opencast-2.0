import fs from "fs";

export default function handler(req, res) {
  const { fileName } = req.body;
  console.log(fileName);
  fs.unlinkSync(`./public/uploads/${fileName}`);
  res.status(200).json({ name: "John Doe" });
}
