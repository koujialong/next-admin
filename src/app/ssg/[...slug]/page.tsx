import { getBlogFiles } from "@/app/lib/utils";
import MarkdownRenderer from "@/components/markdown-rendere";
import fs from "fs";
import path from "path";
type Props = {
  params: {
    slug: string[];
  };
};

export const revalidate = 1000000;

export const dynamicParams = false;
export const ssgPaths = ["src", "app", "ssg", "md"];
export default async function SSG({ params }: Props) {
  const time = new Date().toLocaleString();
  const {
    slug: [name],
  } = await params;
  const filePath = decodeURIComponent(
    path.join(process.cwd(), ...ssgPaths, name)
  );
  if (!fs.existsSync(filePath)) {
    return <div>Not found</div>;
  }
  console.log("filePath", filePath);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return (
    <div className="p-6">
      <div>页面渲染时间: {time}</div>
      <MarkdownRenderer content={fileContent}></MarkdownRenderer>
    </div>
  );
}

export async function generateStaticParams() {
  const files = getBlogFiles(ssgPaths);
  return files.map((name) => ({
    slug: [name],
  }));
}
