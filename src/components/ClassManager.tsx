import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCreateClass } from '@/hooks/useClasses';

export const ClassManager = () => {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState('');
  const createClass = useCreateClass();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    await createClass.mutateAsync(className);
    setClassName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Plus className="h-4 w-4 mr-2" />
          Nova Turma
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Turma</DialogTitle>
            <DialogDescription>
              Adicione uma nova turma ao sistema
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="class-name">Nome da Turma</Label>
            <Input
              id="class-name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ex: 3º Ano A"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createClass.isPending}>
              {createClass.isPending ? 'Criando...' : 'Criar Turma'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
