"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageQualityState,
  useImageQualityStore,
} from "../stores/image-quality";

export function ImageQualitySelect() {
  const size = useImageQualityStore((store) => store.size);
  const setSize = useImageQualityStore((store) => store.setSize);

  return (
    <Select
      onValueChange={(value) => setSize(value as ImageQualityState["size"])}
      defaultValue={size}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Quality" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sm">Mobile</SelectItem>
        <SelectItem value="md">SD</SelectItem>
        <SelectItem value="lg">HD</SelectItem>
        <SelectItem value="xl">Full HD</SelectItem>
        <SelectItem value="2xl">4K</SelectItem>
      </SelectContent>
    </Select>
  );
}
