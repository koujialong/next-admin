import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentZoneTime(zone: number) {
  const timezone = zone; //目标时区
  const offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
  const nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
  const targetDate = new Date(
    nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
  ); //当前东八区的时间
  const current = targetDate.toLocaleString() //当前时区时间戳
  console.log(current);
  return current;
}
