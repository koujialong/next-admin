import { getBlogFiles } from "@/app/lib/utils";
import MarkdownRenderer from "@/components/markdown-rendere";
import fs from "fs";
import path from "path";
type Props = {
  params: {
    slug: string[];
  };
};

export const revalidate = 6000;

export const dynamicParams = true;
export const isrPaths = ["src", "app", "isr", "md"];
export default async function ISR({ params }: Props) {
  const {
    slug: [name],
  } = await params;
  const time = new Date().toLocaleString();
  const filePath = decodeURIComponent(
    path.join(process.cwd(), ...isrPaths, name)
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
  const files = getBlogFiles(isrPaths);
  return files.slice(0, 1).map((name) => ({
    slug: [name],
  }));
}
