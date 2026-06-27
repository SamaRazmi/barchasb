"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
  href?: string;
}

const menuItems: MenuItem[] = [
  { title: "خانه", subItems: [], icon: "/images/home_res.png", href: "/" },
  {
    title: "درباره ما",
    subItems: [],
    icon: "/images/about_res.png",
    href: "/about-us",
  },
  {
    title: "برچسب کلاب",
    subItems: [],
    icon: "/images/club-menu1.svg",
    href: "/club",
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

          const content = (
            <AccordionSummary
              expandIcon={
                hasSubItems && (
                  <ArrowBackIosNewIcon
                    sx={{
                      color: "#fff",
                      width: 12,
                      height: 12,
                      minWidth: 12,
                    }}
                  />
                )
              }
              sx={{
                minHeight: "40px",
                px: 1,
                backgroundColor: bgColor,
                borderRadius: "5px",
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
          );

          return (
            <Accordion
              key={item.title}
              expanded={expanded === item.title}
              onChange={hasSubItems ? handleChange(item.title) : undefined}
              disableGutters
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              {item.href && !hasSubItems ? (
                <Link
                  href={item.href}
                  onClick={onClose}
                  style={{ textDecoration: "none" }}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </Accordion>
          );
        })}
      </Box>
    </Drawer>
  );
};

export default DrawerRes;
