/**
 * Report service for generating PDF and documentation
 */

import { LaborSession } from '@/types/labor'
import { logger } from '@/utils/logger'
import { formatDateTime, formatDuration, formatDate } from '@/utils/formatting'

export class ReportService {
  /**
   * Generate PDF report of labor session
   */
  static async generatePDF(session: LaborSession): Promise<Blob | null> {
    try {
      // Dynamic import of jsPDF to reduce bundle size
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      // Create HTML content
      const htmlContent = this.generateHTMLReport(session)

      // Create temporary container
      const container = document.createElement('div')
      container.innerHTML = htmlContent
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.width = '800px'
      document.body.appendChild(container)

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#fff',
      })

      // Remove temporary container
      document.body.removeChild(container)

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgData = canvas.toDataURL('image/png')
      const pageHeight = pdf.internal.pageSize.getHeight()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add multiple pages if needed
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight)
        heightLeft -= pageHeight
        if (heightLeft > 0) {
          pdf.addPage()
          position = heightLeft - imgHeight
        }
      }

      const blob = pdf.output('blob')
      logger.info('ReportService: PDF generated successfully')
      return blob
    } catch (error) {
      logger.error('ReportService: Failed to generate PDF', error)
      return null
    }
  }

  /**
   * Generate HTML report
   */
  private static generateHTMLReport(session: LaborSession): string {
    const totalDuration = session.endTime
      ? new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
      : 0
    // const totalMinutes = Math.round(totalDuration / 60000)

    const contractionStats = {
      total: session.contractions.length,
      avgDuration: session.contractions.length
        ? Math.round(
            session.contractions.reduce((sum, c) => sum + c.duration, 0) / session.contractions.length
          )
        : 0,
    }

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Parto - Parto Magnus</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #a855f7; padding-bottom: 20px; }
          .header h1 { color: #a855f7; font-size: 28px; margin-bottom: 10px; }
          .header p { color: #666; font-size: 14px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; color: #a855f7; margin-bottom: 15px; border-left: 4px solid #a855f7; padding-left: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .info-box { background-color: #f5f5f5; padding: 15px; border-radius: 8px; }
          .info-box label { font-weight: bold; color: #666; font-size: 12px; display: block; margin-bottom: 5px; }
          .info-box value { font-size: 16px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background-color: #a855f7; color: white; padding: 10px; text-align: left; font-weight: bold; }
          td { border-bottom: 1px solid #ddd; padding: 10px; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .alert-red { background-color: #ffe0e0; border-left: 4px solid #ff7d7d; padding: 10px; margin: 10px 0; }
          .alert-yellow { background-color: #fff5e0; border-left: 4px solid #ffa94d; padding: 10px; margin: 10px 0; }
          .alert-green { background-color: #e0ffe0; border-left: 4px solid #51cf66; padding: 10px; margin: 10px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Relatório de Parto</h1>
            <p>Parto Magnus - Acompanhamento de Parto Baseado em Evidências</p>
          </div>

          <!-- Session Info -->
          <div class="section">
            <div class="section-title">Informações da Sessão</div>
            <div class="info-grid">
              <div class="info-box">
                <label>Data de Início</label>
                <value>${formatDateTime(session.startTime)}</value>
              </div>
              <div class="info-box">
                <label>Data de Término</label>
                <value>${session.endTime ? formatDateTime(session.endTime) : 'Em andamento'}</value>
              </div>
              <div class="info-box">
                <label>Duração Total</label>
                <value>${formatDuration(totalDuration / 1000)}</value>
              </div>
              <div class="info-box">
                <label>Desfecho</label>
                <value>${session.outcome || 'Não registrado'}</value>
              </div>
            </div>
          </div>

          <!-- Contractions Summary -->
          <div class="section">
            <div class="section-title">Resumo de Contrações</div>
            <div class="info-grid">
              <div class="info-box">
                <label>Total de Contrações</label>
                <value>${contractionStats.total}</value>
              </div>
              <div class="info-box">
                <label>Duração Média</label>
                <value>${contractionStats.avgDuration}s</value>
              </div>
            </div>
          </div>

          <!-- Baby Info -->
          ${
            session.babyWeight || session.babyHeight
              ? `
            <div class="section">
              <div class="section-title">Informações do Bebê</div>
              <div class="info-grid">
                ${session.babyWeight ? `<div class="info-box"><label>Peso</label><value>${session.babyWeight}g</value></div>` : ''}
                ${session.babyHeight ? `<div class="info-box"><label>Comprimento</label><value>${session.babyHeight}cm</value></div>` : ''}
                ${session.babyApgar ? `<div class="info-box"><label>Apgar 1º min</label><value>${session.babyApgar.one}</value></div>` : ''}
                ${session.babyApgar?.five ? `<div class="info-box"><label>Apgar 5º min</label><value>${session.babyApgar.five}</value></div>` : ''}
              </div>
            </div>
          `
              : ''
          }

          <!-- Alerts -->
          ${
            session.outcome === 'cesarean'
              ? '<div class="alert-yellow"><strong>Resultado:</strong> Parto foi finalizado por cesariana.</div>'
              : session.outcome === 'vaginal'
              ? '<div class="alert-green"><strong>Resultado:</strong> Parto vaginal realizado com sucesso!</div>'
              : ''
          }

          <!-- Footer -->
          <div class="footer">
            <p>Este relatório foi gerado automaticamente pelo aplicativo Parto Magnus.</p>
            <p>Data de geração: ${formatDate(new Date())}</p>
            <p>Para dúvidas, consulte seu médico ou profissional de saúde.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Download PDF report
   */
  static async downloadPDF(session: LaborSession, filename?: string): Promise<void> {
    try {
      const blob = await this.generatePDF(session)
      if (!blob) {
        logger.error('ReportService: Failed to generate PDF for download')
        return
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `parto-${formatDate(new Date())}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      logger.info('ReportService: PDF downloaded successfully')
    } catch (error) {
      logger.error('ReportService: Failed to download PDF', error)
    }
  }

  /**
   * Share PDF report
   */
  static async sharePDF(session: LaborSession): Promise<boolean> {
    try {
      const blob = await this.generatePDF(session)
      if (!blob || !navigator.share) {
        return false
      }

      const file = new File([blob], `parto-${formatDate(new Date())}.pdf`, { type: 'application/pdf' })

      await navigator.share({
        title: 'Relatório de Parto',
        text: 'Meu relatório de parto do aplicativo Parto Magnus',
        files: [file],
      })

      logger.info('ReportService: PDF shared successfully')
      return true
    } catch (error) {
      logger.error('ReportService: Failed to share PDF', error)
      return false
    }
  }

  /**
   * Generate text summary
   */
  static generateSummary(session: LaborSession): string {
    const startDate = formatDateTime(session.startTime)
    const endDate = session.endTime ? formatDateTime(session.endTime) : 'Em andamento'
    const totalContractions = session.contractions.length
    const outcome = session.outcome || 'Não registrado'

    return `
RELATÓRIO DE PARTO - PARTO MAGNUS
====================================

Data de Início: ${startDate}
Data de Término: ${endDate}
Total de Contrações: ${totalContractions}
Desfecho: ${outcome}

${
  session.babyWeight
    ? `
Informações do Bebê:
- Peso: ${session.babyWeight}g
- Comprimento: ${session.babyHeight}cm
`
    : ''
}

Este é um relatório gerado automaticamente.
Para informações clínicas detalhadas, consulte seu médico.
    `.trim()
  }
}
