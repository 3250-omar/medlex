import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function sanitize(str: string): string {
  return str
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2014\u2013]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number,
): string[] {
  const clean = sanitize(text);
  if (!clean) return [];
  const words = clean.split(" ");
  const lines: string[] = [];
  let cur = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const test = cur + " " + words[i];
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      cur = test;
    } else {
      lines.push(cur);
      cur = words[i];
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function openPackPdf(
  root: HTMLElement,
  mode: "all" | "cand" | "role" | "obs",
  stationTitle: string,
): Promise<string> {
  const allCards = Array.from(
    root.querySelectorAll<HTMLElement>("#packs .pcard, .pack .pcard, .pcard"),
  );

  let targetCards = allCards;
  if (mode === "cand") {
    targetCards = allCards.filter((c) => c.classList.contains("c-cand"));
  } else if (mode === "role") {
    targetCards = allCards.filter(
      (c) => c.classList.contains("c-role") || c.classList.contains("c-interp"),
    );
  } else if (mode === "obs") {
    targetCards = allCards.filter((c) => c.classList.contains("c-obs"));
  }

  if (targetCards.length === 0) targetCards = allCards;

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const MARGIN = 40;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  const navy = rgb(7 / 255, 19 / 255, 38 / 255);
  const gold = rgb(153 / 255, 115 / 255, 46 / 255);
  const dark = rgb(17 / 255, 24 / 255, 39 / 255);
  const muted = rgb(100 / 255, 116 / 255, 139 / 255);
  const lightBg = rgb(247 / 255, 249 / 255, 252 / 255);
  const borderCol = rgb(220 / 255, 226 / 255, 235 / 255);

  const drawHeader = (page: any, cardTitle: string, subtitle: string) => {
    // Top Brand Bar
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_H - 45,
      width: CONTENT_W,
      height: 24,
      color: navy,
    });
    page.drawText("MEDLEX CASC ACADEMY", {
      x: MARGIN + 10,
      y: PAGE_H - 38,
      size: 9,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    const sTitle = sanitize(stationTitle) || "CASC Practice Station";
    const titleWidth = fontRegular.widthOfTextAtSize(sTitle, 8.5);
    page.drawText(sTitle, {
      x: Math.max(MARGIN + 160, PAGE_W - MARGIN - titleWidth - 10),
      y: PAGE_H - 38,
      size: 8.5,
      font: fontRegular,
      color: rgb(247 / 255, 238 / 255, 217 / 255),
    });

    // Gold separator
    page.drawLine({
      start: { x: MARGIN, y: PAGE_H - 47 },
      end: { x: PAGE_W - MARGIN, y: PAGE_H - 47 },
      thickness: 1.5,
      color: gold,
    });

    // Card Title Header
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_H - 85,
      width: CONTENT_W,
      height: 32,
      color: lightBg,
      borderColor: borderCol,
      borderWidth: 1,
    });
    const sCardTitle = sanitize(cardTitle) || "Practice Card";
    page.drawText(sCardTitle, {
      x: MARGIN + 12,
      y: PAGE_H - 74,
      size: 13,
      font: fontBold,
      color: navy,
    });
    const sSub = subtitle ? sanitize(subtitle) : "";
    if (sSub) {
      page.drawText(sSub, {
        x: MARGIN + 12 + fontBold.widthOfTextAtSize(sCardTitle, 13) + 10,
        y: PAGE_H - 74,
        size: 9.5,
        font: fontRegular,
        color: gold,
      });
    }

    return PAGE_H - 105;
  };

  const drawFooter = (page: any, pageIndex: number, totalPages: number) => {
    page.drawLine({
      start: { x: MARGIN, y: 36 },
      end: { x: PAGE_W - MARGIN, y: 36 },
      thickness: 0.75,
      color: borderCol,
    });
    page.drawText(
      "MedLex CASC Examination Practice Pack - Personal Study Use",
      {
        x: MARGIN,
        y: 24,
        size: 8,
        font: fontRegular,
        color: muted,
      },
    );
    const pageStr = `Page ${pageIndex + 1} of ${totalPages}`;
    const pWidth = fontRegular.widthOfTextAtSize(pageStr, 8);
    page.drawText(pageStr, {
      x: PAGE_W - MARGIN - pWidth,
      y: 24,
      size: 8,
      font: fontRegular,
      color: muted,
    });
  };

  for (const card of targetCards) {
    let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    const cardHeading =
      card.querySelector(".ph b")?.textContent || "Practice Card";
    const cardSubtitle = card.querySelector(".ph span")?.textContent || "";
    let curY = drawHeader(page, cardHeading, cardSubtitle);

    const body = card.querySelector<HTMLElement>(".pb") || card;

    const checkY = (neededSpace = 20) => {
      if (curY - neededSpace < 50) {
        page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        curY = drawHeader(page, `${cardHeading} (cont.)`, cardSubtitle);
      }
    };

    // Render body children sequentially
    const children = Array.from(body.children) as HTMLElement[];
    for (const child of children) {
      if (child.classList.contains("ph")) continue;

      if (child.tagName === "P") {
        checkY(24);
        const lines = wrapText(
          child.textContent || "",
          fontRegular,
          10,
          CONTENT_W,
        );
        for (const line of lines) {
          checkY(16);
          page.drawText(line, {
            x: MARGIN,
            y: curY,
            size: 10,
            font: fontRegular,
            color: dark,
          });
          curY -= 15;
        }
        curY -= 6;
      } else if (child.tagName === "UL") {
        const lis = Array.from(child.querySelectorAll("li"));
        for (const li of lis) {
          const lines = wrapText(
            li.textContent || "",
            fontRegular,
            10,
            CONTENT_W - 18,
          );
          for (let i = 0; i < lines.length; i++) {
            checkY(16);
            if (i === 0) {
              page.drawText("-", {
                x: MARGIN + 4,
                y: curY,
                size: 11,
                font: fontBold,
                color: gold,
              });
            }
            page.drawText(lines[i], {
              x: MARGIN + 18,
              y: curY,
              size: 10,
              font: fontRegular,
              color: dark,
            });
            curY -= 15;
          }
        }
        curY -= 6;
      } else if (child.classList.contains("secret")) {
        const text = child.textContent || "";
        const lines = wrapText(text, fontRegular, 9.5, CONTENT_W - 24);
        const boxHeight = lines.length * 14 + 18;
        checkY(boxHeight + 10);

        page.drawRectangle({
          x: MARGIN,
          y: curY - boxHeight + 12,
          width: CONTENT_W,
          height: boxHeight,
          color: rgb(254 / 255, 252 / 255, 245 / 255),
          borderColor: gold,
          borderWidth: 1.2,
        });

        let boxY = curY - 4;
        for (let i = 0; i < lines.length; i++) {
          const isHeader = i === 0 && lines[i].includes("HIDDEN INFORMATION");
          page.drawText(lines[i], {
            x: MARGIN + 12,
            y: boxY,
            size: isHeader ? 9.5 : 9,
            font: isHeader ? fontBold : fontRegular,
            color: isHeader ? navy : dark,
          });
          boxY -= 14;
        }
        curY -= boxHeight + 10;
      } else if (child.tagName === "TABLE" || child.classList.contains("rub")) {
        // Rubric table
        const rows = Array.from(child.querySelectorAll("tr"));
        for (const row of rows) {
          if (row.classList.contains("dom")) {
            checkY(26);
            page.drawRectangle({
              x: MARGIN,
              y: curY - 14,
              width: CONTENT_W,
              height: 20,
              color: lightBg,
            });
            const domName = sanitize(
              row.querySelector("b")?.textContent || row.textContent || "",
            );
            const score = sanitize(
              row.querySelector(".dc")?.textContent || "0/3",
            );
            page.drawText(domName, {
              x: MARGIN + 8,
              y: curY - 9,
              size: 10,
              font: fontBold,
              color: navy,
            });
            page.drawText(score, {
              x: PAGE_W - MARGIN - 30,
              y: curY - 9,
              size: 9.5,
              font: fontBold,
              color: gold,
            });
            curY -= 22;
          } else {
            const cells = Array.from(row.querySelectorAll("td"));
            const text = sanitize(cells[cells.length - 1]?.textContent || "");
            const lines = wrapText(text, fontRegular, 9.5, CONTENT_W - 26);
            for (let i = 0; i < lines.length; i++) {
              checkY(16);
              if (i === 0) {
                // Checkbox square
                page.drawRectangle({
                  x: MARGIN + 6,
                  y: curY - 1,
                  width: 9,
                  height: 9,
                  borderColor: muted,
                  borderWidth: 1,
                });
              }
              page.drawText(lines[i], {
                x: MARGIN + 24,
                y: curY,
                size: 9.5,
                font: fontRegular,
                color: dark,
              });
              curY -= 14;
            }
            curY -= 4;
          }
        }
      } else {
        // Generic fallback for judgement blocks or extra divs
        const lines = wrapText(
          child.textContent || "",
          fontRegular,
          9.5,
          CONTENT_W,
        );
        for (const line of lines) {
          checkY(15);
          page.drawText(line, {
            x: MARGIN,
            y: curY,
            size: 9.5,
            font: fontRegular,
            color: dark,
          });
          curY -= 14;
        }
        curY -= 4;
      }
    }
  }

  // Draw footers with accurate total page count
  const totalPages = pdfDoc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    drawFooter(pdfDoc.getPage(i), i, totalPages);
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], {
    type: "application/pdf",
  });
  return URL.createObjectURL(blob);
}
