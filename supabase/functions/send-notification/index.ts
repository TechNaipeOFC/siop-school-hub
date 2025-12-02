import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  responsibleEmail?: string;
  responsiblePhone?: string;
  responsibleName: string;
  studentName: string;
  occurrenceType: string;
  occurrenceSeverity: string;
  occurrenceDescription: string;
  occurrenceDate: string;
}

const getSeverityLabel = (severity: string): string => {
  const labels: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    critica: 'Crítica'
  };
  return labels[severity] || severity;
};

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    comportamento: 'Comportamento',
    pedagogico: 'Pedagógico',
    indisciplina: 'Indisciplina'
  };
  return labels[type] || type;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received notification request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    console.log("Notification data:", JSON.stringify(data, null, 2));

    const {
      responsibleEmail,
      responsibleName,
      studentName,
      occurrenceType,
      occurrenceSeverity,
      occurrenceDescription,
      occurrenceDate
    } = data;

    if (!responsibleEmail) {
      console.log("No email provided, skipping email notification");
      return new Response(
        JSON.stringify({ success: true, message: "No email provided" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const formattedDate = new Date(occurrenceDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const severityColor = occurrenceSeverity === 'critica' ? '#dc2626' : 
                          occurrenceSeverity === 'alta' ? '#ea580c' :
                          occurrenceSeverity === 'media' ? '#ca8a04' : '#16a34a';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Ocorrência - SIOP</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #1a1a1a; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            📚 SIOP - Nova Ocorrência Registrada
          </h1>
          
          <p style="color: #4a4a4a; font-size: 16px;">
            Prezado(a) <strong>${responsibleName}</strong>,
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px;">
            Uma nova ocorrência foi registrada para o(a) aluno(a) <strong>${studentName}</strong>.
          </p>
          
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #1a1a1a; font-size: 18px; margin-top: 0;">Detalhes da Ocorrência</h2>
            
            <p style="margin: 10px 0;">
              <strong>Data:</strong> ${formattedDate}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Tipo:</strong> ${getTypeLabel(occurrenceType)}
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Gravidade:</strong> 
              <span style="background-color: ${severityColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 14px;">
                ${getSeverityLabel(occurrenceSeverity)}
              </span>
            </p>
            
            <p style="margin: 10px 0;">
              <strong>Descrição:</strong><br>
              <span style="color: #4a4a4a;">${occurrenceDescription}</span>
            </p>
          </div>
          
          <p style="color: #4a4a4a; font-size: 14px; margin-top: 30px;">
            Este é um e-mail automático do Sistema Integrado de Ocorrências Pedagógicas (SIOP).
            Por favor, entre em contato com a escola caso tenha dúvidas.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <p style="color: #9a9a9a; font-size: 12px; text-align: center;">
            SIOP - Sistema Integrado de Ocorrências Pedagógicas
          </p>
        </div>
      </body>
      </html>
    `;

    console.log("Sending email to:", responsibleEmail);

    const emailResponse = await resend.emails.send({
      from: "SIOP <onboarding@resend.dev>",
      to: [responsibleEmail],
      subject: `[SIOP] Nova Ocorrência - ${studentName}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
