export function assertAdmin(key: string) {
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    throw new Error("Unauthorized");
  }
}