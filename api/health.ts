export default async function handler(req: any, res: any): Promise<void> {
  res.status(200).json({ hasDbUrl: !!process.env.DATABASE_URL, node: process.version });
}
