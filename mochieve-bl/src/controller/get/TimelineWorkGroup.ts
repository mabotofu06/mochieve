
import { Request, Response } from "express";

export const getTimelineWorkGroup = (req: Request, res: Response) => {
  const { id } = req.params;
  // ここでデータベースからワークグループのタイムラインを取得するロジックを実装
  res.json({ id, title: "sample group", images: [], note: "" });
};
