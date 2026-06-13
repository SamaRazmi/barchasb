"use client";

import { FieldArray, useFormikContext } from "formik";
import { useEffect } from "react";

// تعریف اینترفیس برای ستون‌های جدول
export interface ColumnDefinition<T> {
  key: keyof T; // کلید باید یکی از فیلدهای شیء داده باشد
  label: string;
  placeholder?: string;
}

// تعریف پراپ‌های کامپوننت
interface DynamicTableProps<T> {
  name: string;
  columns: ColumnDefinition<T>[];
  lable: string; // با توجه به کد شما (lable)
  initialRows?: number;
  maxRows?: number;
}

export default function DynamicTable<T extends Record<string, any>>({
  name,
  columns,
  lable,
  initialRows = 2,
  maxRows = 3,
}: DynamicTableProps<T>) {
  const { values, setFieldValue } = useFormikContext<Record<string, T[]>>();

  useEffect(() => {
    // بررسی مقدار اولیه
    if (!values[name]) {
      const emptyRow = columns.reduce(
        (acc, col) => ({ ...acc, [col.key]: "" }),
        {} as T,
      );
      const emptyRows = Array(initialRows)
        .fill(null)
        .map(() => ({ ...emptyRow }));
      setFieldValue(name, emptyRows);
    }
  }, [name, values, setFieldValue, columns, initialRows]);

  const rows = values[name] as T[] | undefined;

  if (!rows) return null;

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="w-full">
          <div className="text-[20px] font-bold text-[#2D3E48] pb-1">
            {lable} :
          </div>

          <div className="border-2 border-[#FEBD59] rounded-[20px] p-2 overflow-x-auto">
            <table className="min-w-[500px] w-full">
              <thead>
                <tr className="text-[#2D3E48] font-bold">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className="px-4 py-2 border-l-2 border-[#FEBD59]"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-2">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t-2 border-[#FEBD59]">
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-3 py-2 border-l-2 border-[#FEBD59]"
                      >
                        <input
                          type="text"
                          placeholder={col.placeholder || ""}
                          value={row[col.key] as string}
                          onChange={(e) =>
                            setFieldValue(
                              `${name}.${index}.${String(col.key)}`,
                              e.target.value,
                            )
                          }
                          className="w-full outline-none bg-transparent"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 font-bold"
                        disabled={rows.length <= 1}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end p-3">
            <button
              type="button"
              onClick={() =>
                push(
                  columns.reduce(
                    (acc, col) => ({ ...acc, [col.key]: "" }),
                    {} as T,
                  ),
                )
              }
              className={`px-4 py-2 bg-[#FEBD59] rounded-[15px] text-[#2D3E48] font-bold hover:bg-[#f8a72e] transition ${
                rows.length >= maxRows ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={rows.length >= maxRows}
            >
              + اضافه کردن
            </button>
          </div>
        </div>
      )}
    </FieldArray>
  );
}
