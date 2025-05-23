import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableHeader, TableRow, TableBody, Table } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ProducerForm } from "@/components/producers/forms/form-producer";

import { useProducerStore } from "@/stores/useProducerStore";

export function TableProducers() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { producers, deleteProducer, isHydrated } = useProducerStore()

  function toggleExpand(id: string) {
    setExpandedIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Fazendas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        {!isHydrated ? (
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Skeleton className="w-10 h-10" />
                  <Skeleton className="w-10 h-10" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {producers.map((producer) => {
              const isExpanded = expandedIds.includes(producer.id);
              return (
                <Fragment key={producer.id}>
                  <TableRow>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(producer.id)}>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{producer.name}</TableCell>
                    <TableCell>{producer.document}</TableCell>
                    <TableCell>{producer.farms?.length ?? 0}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <ProducerForm isEdit={producer} />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteProducer(producer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50 p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Fazenda</TableHead>
                              <TableHead>Área</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {producer.farms?.length && producer.farms?.length > 0 ? (
                              producer.farms?.map((farm) => (
                                <TableRow key={farm.id}>
                                  <TableCell>{farm.name}</TableCell>
                                  <TableCell>{farm.totalArea ?? "N/A"} ha</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center italic text-gray-500">
                                  Nenhuma fazenda cadastrada.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
