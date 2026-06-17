import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (element: HTMLElement, filename: string): Promise<void> => {
  if (!element) {
    throw new Error('导出元素不存在');
  }

  const originalStyle = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    zIndex: element.style.zIndex,
    opacity: element.style.opacity,
    pointerEvents: element.style.pointerEvents,
  };

  try {
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '9999';
    element.style.opacity = '1';
    element.style.pointerEvents = 'none';

    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;

    const pageHeight = pdfHeight;
    let heightLeft = imgHeight * ratio;
    let position = 0;

    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight * ratio;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF 导出失败:', error);
    throw error;
  } finally {
    element.style.position = originalStyle.position;
    element.style.left = originalStyle.left;
    element.style.top = originalStyle.top;
    element.style.zIndex = originalStyle.zIndex;
    element.style.opacity = originalStyle.opacity;
    element.style.pointerEvents = originalStyle.pointerEvents;
  }
};
