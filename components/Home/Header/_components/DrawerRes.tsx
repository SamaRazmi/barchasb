"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Drawer,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface DrawerResProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  subItems: string[];
  icon: string;
}

const menuItems: MenuItem[] = [
  { title: "خانه", subItems: [], icon: "/images/home_res.png" },
  { title: "درباره ما", subItems: [], icon: "/images/about_res.png" },
  {
    title: "استخدام کارجو",
    subItems: ["زیرمنو 1", "زیرمنو 2"],
    icon: "/images/employ_res.png",
  },
  {
    title: "پیدا کردن کار",
    subItems: ["زیرمنو 1", "زیرمنو 2"],
    icon: "/images/work_res.png",
  },
];

const DrawerRes: React.FC<DrawerResProps> = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (title: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? title : false);
    };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#143A62",
          marginTop: "20px",
          marginBottom: "calc(20px + env(safe-area-inset-bottom))",
          height: "calc(100vh - 40px - env(safe-area-inset-bottom))",

          left: 0,
          right: "20px",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          overflow: "hidden",
        },
      }}
      SlideProps={{ direction: "right" }}
      ModalProps={{ keepMounted: true, BackdropProps: { invisible: true } }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 2,
          height: "100%",
          overflowY: "auto",
        }}
      >
        {/* دکمه بستن */}
        <Box sx={{ display: "flex" }}>
          <IconButton onClick={onClose} sx={{ p: 0, ml: "auto" }}>
            <Image src="/images/close.png" width={20} height={20} alt="close" />
          </IconButton>
        </Box>

        {/* آیتم‌های منو */}
        {menuItems.map((item) => {
          const bgColor = item.title === "خانه" ? "#FFFFFF26" : "#FFFFFF0D";
          const hasSubItems = item.subItems.length > 0;

          return (
            <Accordion
              key={item.title}
              expanded={expanded === item.title}
              onChange={hasSubItems ? handleChange(item.title) : undefined}
              disableGutters
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                borderRadius: "5px",
              }}
            >
              <AccordionSummary
                expandIcon={
                  hasSubItems && (
                    <ArrowBackIosNewIcon
                      sx={{
                        color: "#fff",
                        width: 12,
                        height: 12,
                        minWidth: 12,
                        transition: "transform 0.2s",
                        ".MuiAccordionSummary-expandIconWrapper.Mui-expanded &":
                          {
                            transform: "rotate(90deg)",
                          },
                      }}
                    />
                  )
                }
                sx={{
                  minHeight: "40px",
                  px: 1,
                  backgroundColor: bgColor,
                  "&:hover": { backgroundColor: bgColor },
                  borderRadius: "5px",
                  "&.Mui-expanded": {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Image
                    src={item.icon}
                    width={23}
                    height={23}
                    alt={item.title}
                  />
                  <Typography
                    sx={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              </AccordionSummary>

              {hasSubItems && (
                <AccordionDetails
                  sx={{
                    p: 1,
                    backgroundColor: bgColor,
                    borderBottomLeftRadius: "5px",
                    borderBottomRightRadius: "5px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {item.subItems.map((sub, i) => (
                    <Box
                      key={i}
                      sx={{
                        backgroundColor: "#0000001A",
                        borderRadius:
                          i === item.subItems.length - 1 ? "5px" : 0,
                        px: 1,
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontSize: "14px", color: "#fff" }}>
                        {sub}
                      </Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              )}
            </Accordion>
          );
        })}
      </Box>
    </Drawer>
  );
};

export default DrawerRes;
