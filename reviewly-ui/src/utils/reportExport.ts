/**
 * Report Export Utilities for Reviewly Application
 * 
 * Utilities for generating and exporting professional reports in PDF and Word formats
 * with customizable templates and formatting options.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

// Types for report export
export interface ReportData {
  title: string;
  subtitle?: string;
  employeeName: string;
  employeeId: string;
  department: string;
  reviewPeriod: string;
  generatedDate: Date;
  sections: ReportSection[];
  summary?: ReportSummary;
  metadata?: ReportMetadata;
}

export interface ReportSection {
  id: string;
  title: string;
  content: ReportContent[];
  type: 'text' | 'table' | 'chart' | 'list' | 'rating';
}

export interface ReportContent {
  type: 'paragraph' | 'bullet' | 'table' | 'rating' | 'chart';
  data: any;
  formatting?: ContentFormatting;
}

export interface ContentFormatting {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ReportSummary {
  overallRating: number;
  keyStrengths: string[];
  improvementAreas: string[];
  goals: string[];
  recommendations: string[];
}

export interface ReportMetadata {
  template: string;
  version: string;
  exportedBy: string;
  confidential: boolean;
  watermark?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'docx';
  template: 'standard' | 'executive' | 'detailed' | 'summary';
  includeCharts: boolean;
  includeSignatures: boolean;
  watermark?: string;
  headerLogo?: string;
  footerText?: string;
}

// PDF Export Functions
export const exportToPDF = async (
  reportData: ReportData,
  options: ExportOptions = { format: 'pdf', template: 'standard', includeCharts: true, includeSignatures: false }
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      addHeader();
    }
  };

  // Add header
  const addHeader = () => {
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(reportData.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    if (reportData.subtitle) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData.subtitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    }

    // Add line separator
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  };

  // Add footer
  const addFooter = () => {
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${reportData.generatedDate.toLocaleDateString()}`, margin, footerY);
    pdf.text(`Page ${pdf.getCurrentPageInfo().pageNumber}`, pageWidth - margin, footerY, { align: 'right' });
    
    if (options.footerText) {
      pdf.text(options.footerText, pageWidth / 2, footerY, { align: 'center' });
    }
  };

  // Add employee information
  const addEmployeeInfo = () => {
    checkPageBreak(30);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Employee Information', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${reportData.employeeName}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Employee ID: ${reportData.employeeId}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Department: ${reportData.department}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Review Period: ${reportData.reviewPeriod}`, margin, yPosition);
    yPosition += 10;
  };

  // Add section content
  const addSection = (section: ReportSection) => {
    checkPageBreak(20);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(section.title, margin, yPosition);
    yPosition += 10;

    section.content.forEach(content => {
      switch (content.type) {
        case 'paragraph':
          addParagraph(content.data);
          break;
        case 'bullet':
          addBulletPoint(content.data);
          break;
        case 'table':
          addTable(content.data);
          break;
        case 'rating':
          addRating(content.data);
          break;
      }
    });

    yPosition += 5;
  };

  const addParagraph = (text: string) => {
    checkPageBreak(15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });
    yPosition += 3;
  };

  const addBulletPoint = (text: string) => {
    checkPageBreak(8);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('•', margin, yPosition);
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin - 10);
    lines.forEach((line: string, index: number) => {
      checkPageBreak(6);
      pdf.text(line, margin + 10, yPosition);
      if (index < lines.length - 1) yPosition += 6;
    });
    yPosition += 8;
  };

  const addTable = (tableData: any[][]) => {
    const cellHeight = 8;
    const cellWidth = (pageWidth - 2 * margin) / tableData[0].length;
    
    tableData.forEach((row, rowIndex) => {
      checkPageBreak(cellHeight);
      
      row.forEach((cell, cellIndex) => {
        const x = margin + cellIndex * cellWidth;
        
        // Draw cell border
        pdf.rect(x, yPosition - cellHeight + 2, cellWidth, cellHeight);
        
        // Add cell text
        pdf.setFontSize(9);
        pdf.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal');
        pdf.text(String(cell), x + 2, yPosition - 2);
      });
      
      yPosition += cellHeight;
    });
    yPosition += 5;
  };

  const addRating = (ratingData: { label: string; value: number; maxValue: number }) => {
    checkPageBreak(15);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${ratingData.label}: ${ratingData.value}/${ratingData.maxValue}`, margin, yPosition);
    
    // Draw rating bar
    const barWidth = 100;
    const barHeight = 6;
    const fillWidth = (ratingData.value / ratingData.maxValue) * barWidth;
    
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin + 150, yPosition - 4, barWidth, barHeight, 'F');
    
    pdf.setFillColor(76, 175, 80);
    pdf.rect(margin + 150, yPosition - 4, fillWidth, barHeight, 'F');
    
    yPosition += 12;
  };

  // Add summary section
  const addSummary = () => {
    if (!reportData.summary) return;
    
    checkPageBreak(40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', margin, yPosition);
    yPosition += 10;

    // Overall rating
    addRating({
      label: 'Overall Rating',
      value: reportData.summary.overallRating,
      maxValue: 5
    });

    // Key strengths
    if (reportData.summary.keyStrengths.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Strengths:', margin, yPosition);
      yPosition += 8;
      
      reportData.summary.keyStrengths.forEach(strength => {
        addBulletPoint(strength);
      });
    }

    // Improvement areas
    if (reportData.summary.improvementAreas.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Areas for Improvement:', margin, yPosition);
      yPosition += 8;
      
      reportData.summary.improvementAreas.forEach(area => {
        addBulletPoint(area);
      });
    }
  };

  // Generate PDF
  addHeader();
  addEmployeeInfo();
  
  if (options.template === 'summary' && reportData.summary) {
    addSummary();
  } else {
    reportData.sections.forEach(section => {
      addSection(section);
    });
    
    if (reportData.summary) {
      addSummary();
    }
  }

  // Add watermark if specified
  if (options.watermark) {
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(50);
      pdf.setTextColor(200, 200, 200);
      pdf.text(options.watermark, pageWidth / 2, pageHeight / 2, { 
        align: 'center',
        angle: 45
      });
    }
  }

  // Add footers to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(0, 0, 0);
    addFooter();
  }

  // Save the PDF
  const fileName = `${reportData.employeeName.replace(/\s+/g, '_')}_Review_${reportData.reviewPeriod.replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
};

// Word Document Export Functions
export const exportToWord = async (
  reportData: ReportData,
  options: ExportOptions = { format: 'docx', template: 'standard', includeCharts: false, includeSignatures: false }
): Promise<void> => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: reportData.title,
              bold: true,
              size: 32
            })
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER
        }),

        // Subtitle
        ...(reportData.subtitle ? [
          new Paragraph({
            children: [
              new TextRun({
                text: reportData.subtitle,
                size: 24
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ] : []),

        // Employee Information Table
        new Paragraph({
          children: [
            new TextRun({
              text: "Employee Information",
              bold: true,
              size: 24
            })
          ],
          heading: HeadingLevel.HEADING_1
        }),

        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Name:", bold: true })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: reportData.employeeName })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Employee ID:", bold: true })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: reportData.employeeId })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Department:", bold: true })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: reportData.department })] })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Review Period:", bold: true })] })]
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: reportData.reviewPeriod })] })]
                })
              ]
            })
          ]
        }),

        // Sections
        ...reportData.sections.flatMap(section => [
          new Paragraph({
            children: [
              new TextRun({
                text: section.title,
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          ...section.content.flatMap(content => {
            switch (content.type) {
              case 'paragraph':
                return [new Paragraph({
                  children: [new TextRun({ text: content.data })]
                })];
              case 'bullet':
                return [new Paragraph({
                  children: [new TextRun({ text: content.data })],
                  bullet: { level: 0 }
                })];
              default:
                return [new Paragraph({
                  children: [new TextRun({ text: String(content.data) })]
                })];
            }
          })
        ]),

        // Summary
        ...(reportData.summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "Executive Summary",
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Overall Rating: ${reportData.summary.overallRating}/5`,
                bold: true
              })
            ]
          }),
          ...(reportData.summary.keyStrengths.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Key Strengths:",
                  bold: true
                })
              ]
            }),
            ...reportData.summary.keyStrengths.map(strength =>
              new Paragraph({
                children: [new TextRun({ text: strength })],
                bullet: { level: 0 }
              })
            )
          ] : []),
          ...(reportData.summary.improvementAreas.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Areas for Improvement:",
                  bold: true
                })
              ]
            }),
            ...reportData.summary.improvementAreas.map(area =>
              new Paragraph({
                children: [new TextRun({ text: area })],
                bullet: { level: 0 }
              })
            )
          ] : [])
        ] : [])
      ]
    }]
  });

  // Generate and save the document
  const buffer = await Packer.toBuffer(doc);
  const fileName = `${reportData.employeeName.replace(/\s+/g, '_')}_Review_${reportData.reviewPeriod.replace(/\s+/g, '_')}.docx`;
  saveAs(new Blob([buffer]), fileName);
};

// Utility function to convert HTML element to image for PDF
export const captureElementAsImage = async (element: HTMLElement): Promise<string> => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });
  return canvas.toDataURL('image/png');
};

// Generate report data from various sources
export const generateReportData = (
  employeeData: any,
  reviewData: any,
  analyticsData: any
): ReportData => {
  return {
    title: "Performance Review Report",
    subtitle: "Comprehensive Performance Assessment",
    employeeName: employeeData.name || "Employee Name",
    employeeId: employeeData.id || "EMP001",
    department: employeeData.department || "Department",
    reviewPeriod: reviewData.period || "Q4 2024",
    generatedDate: new Date(),
    sections: [
      {
        id: "performance",
        title: "Performance Overview",
        type: "text",
        content: [
          {
            type: "paragraph",
            data: "This section provides an overview of the employee's performance during the review period."
          },
          {
            type: "rating",
            data: {
              label: "Overall Performance",
              value: reviewData.overallRating || 4.2,
              maxValue: 5
            }
          }
        ]
      },
      {
        id: "goals",
        title: "Goals and Achievements",
        type: "list",
        content: [
          {
            type: "paragraph",
            data: "Key goals and achievements during the review period:"
          },
          ...(reviewData.achievements || []).map((achievement: string) => ({
            type: "bullet",
            data: achievement
          }))
        ]
      },
      {
        id: "skills",
        title: "Skills Development",
        type: "text",
        content: [
          {
            type: "paragraph",
            data: "Skills developed and areas of expertise demonstrated:"
          },
          ...(reviewData.skills || []).map((skill: string) => ({
            type: "bullet",
            data: skill
          }))
        ]
      }
    ],
    summary: {
      overallRating: reviewData.overallRating || 4.2,
      keyStrengths: reviewData.strengths || [
        "Strong technical skills",
        "Excellent communication",
        "Team collaboration"
      ],
      improvementAreas: reviewData.improvements || [
        "Time management",
        "Project planning"
      ],
      goals: reviewData.futureGoals || [
        "Develop leadership skills",
        "Learn new technologies"
      ],
      recommendations: [
        "Continue current performance level",
        "Focus on identified improvement areas",
        "Take on more challenging projects"
      ]
    },
    metadata: {
      template: "standard",
      version: "1.0",
      exportedBy: "Reviewly System",
      confidential: true
    }
  };
};
