"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import style from "./toolbar.module.scss";
import { Copy } from "lucide-react";
type Prop = {
  codeString: string;
};
export default function Toolbar(props: Prop) {
  const { toast } = useToast();
  const handleCopy = (codeString: string) => {
    navigator.clipboard.writeText(codeString);
    toast({ title: "已复制！" });
  };
  return (
    <div className={style.toolbar}>
      <Button
        size="icon"
        variant="outline"
        className={style.copyButton}
        onClick={() => handleCopy(props.codeString)}
      >
        <Copy />
      </Button>
    </div>
  );
}
