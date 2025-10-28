import { Occurrence } from '@/types/occurrence';
import { mockStudents } from '@/lib/mockData';

interface PrintableOccurrenceProps {
  occurrence: Occurrence;
}

export const PrintableOccurrence = ({ occurrence }: PrintableOccurrenceProps) => {
  const student = mockStudents.find(s => s.id === occurrence.studentId);
  
  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto print:p-12" id="printable-occurrence">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-occurrence, #printable-occurrence * {
            visibility: visible;
          }
          #printable-occurrence {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">FICHA DE OCORRÊNCIA ESCOLAR</h1>
        <p className="text-sm">Sistema Integrado de Ocorrências Pedagógicas - SIOP</p>
      </div>

      {/* Dados do Aluno */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-200 p-2">DADOS DO ALUNO</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm"><strong>Nome:</strong> {occurrence.studentName}</p>
          </div>
          <div>
            <p className="text-sm"><strong>Matrícula:</strong> {student?.registration || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm"><strong>Turma:</strong> {student?.class || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm"><strong>Data:</strong> {new Date(occurrence.date).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Dados da Ocorrência */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-200 p-2">DADOS DA OCORRÊNCIA</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm"><strong>Tipo:</strong> {occurrence.type.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm"><strong>Gravidade:</strong> {occurrence.severity.toUpperCase()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm"><strong>Professor(a):</strong> {occurrence.teacherName}</p>
          </div>
          <div>
            <p className="text-sm font-bold">Descrição da Ocorrência:</p>
            <p className="text-sm border border-black p-3 min-h-[100px] mt-2">{occurrence.description}</p>
          </div>
          {occurrence.correctiveAction && (
            <div>
              <p className="text-sm font-bold">Ação Corretiva:</p>
              <p className="text-sm border border-black p-3 min-h-[80px] mt-2">{occurrence.correctiveAction}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dados do Responsável */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 bg-gray-200 p-2">DADOS DO RESPONSÁVEL</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm"><strong>Nome:</strong> {student?.responsibleName || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Termo de Ciência */}
      <div className="mb-8 border-2 border-black p-4">
        <h2 className="text-lg font-bold mb-3 text-center">TERMO DE CIÊNCIA</h2>
        <p className="text-sm mb-4 text-justify">
          Eu, <strong>{student?.responsibleName || '_________________________________'}</strong>, responsável pelo(a) aluno(a) 
          <strong> {occurrence.studentName}</strong>, declaro estar CIENTE da ocorrência escolar registrada nesta data, 
          conforme descrição acima. Comprometo-me a acompanhar o desenvolvimento acadêmico e comportamental do(a) estudante, 
          colaborando com a instituição de ensino para a resolução da situação apresentada.
        </p>
        
        <div className="mt-8 space-y-8">
          <div>
            <p className="text-sm mb-2">Data: ___/___/______</p>
          </div>
          
          <div className="border-t-2 border-black pt-2 mt-12">
            <p className="text-sm text-center">Assinatura do Responsável</p>
          </div>
          
          <div className="border-t-2 border-black pt-2 mt-12">
            <p className="text-sm text-center">Assinatura do(a) Professor(a)</p>
          </div>
          
          <div className="border-t-2 border-black pt-2 mt-12">
            <p className="text-sm text-center">Assinatura da Direção/Coordenação</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 border-t border-gray-400 pt-4">
        <p>Este documento é oficial e deve ser arquivado na pasta do aluno.</p>
        <p>ID da Ocorrência: {occurrence.id} | Gerado em: {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
};