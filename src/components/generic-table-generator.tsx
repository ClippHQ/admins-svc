import { GridColDef, GridValidRowModel, GridPaginationModel } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import { formatAmount } from "src/lib/amount";
import { PaginatedResponse } from "src/types";

export type TransformedUseQueryResult<T> = Omit<UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>>, 'data'> & {
    data: T[];
    rawData:  UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>> ['data'];
}


function titleCase(str: string): string {
    return str
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

type TableCellType<T extends GridValidRowModel> = "text" | "date" | "amount" | ((value: T) => React.ReactNode);
interface GenericTableGeneratorProps<T extends GridValidRowModel> {
  data: T[];
  renderedFields?: (keyof T)[];
  columnRender: Partial<Record<keyof T, TableCellType<T>>>;
  loading?: boolean;
    paginationModel?: GridPaginationModel;
  infiniteQueryResult?: TransformedUseQueryResult<T>;
  onRowClick?: (row: T) => void;
}


export function GenericTableGenerator<T extends GridValidRowModel>({ data, columnRender, renderedFields, paginationModel: model = {
    page: 1,
    pageSize: 20
}, infiniteQueryResult, onRowClick }: GenericTableGeneratorProps<T>) {
    const fieldsToRender = renderedFields || (Object.keys(columnRender) as (keyof T)[]);

    const columns: GridColDef[] = fieldsToRender.map((field) => {
        const renderType = columnRender[field];

        const valueGetter: GridColDef<T>['valueGetter'] = (value, row) => {
            if (typeof renderType === 'function') {
                return renderType(row);
            } else {
                switch (renderType) {
                    case 'text':
                        return value
                    case 'date':
                        return value ? format((value as string), 'dd MMM, yyyy') : '-';
                    case 'amount':
                        return formatAmount({
                            amount: Number(value) / 100,
                            currency: row.currency as string || 'USD',
                        });
                    default:
                        return value;
                }
            }
        }
        return {
                field: field as string,
                headerName: titleCase(field as string),
                flex: 1,
                valueGetter
        } as GridColDef<T>;
       
        
    })

    const rows = useMemo(() => {
        if(!infiniteQueryResult?.rawData?.pages) {
            return data.map((item, index) => ({id: index + 1, ...item}))
        }

        const lastPage = infiniteQueryResult.rawData.pages[infiniteQueryResult.rawData.pages.length -1];
        const startingIndex = 0;
        const pageData = lastPage.payload.map((item, index) => ({id: startingIndex + index +1, ...item}));
        return pageData;
    }, [data, infiniteQueryResult])


        const handlePaginationModelChange = useCallback((newPaginationModel: GridPaginationModel) => {
    // We have the cursor, we can allow the page transition.
            if(!infiniteQueryResult?.rawData?.pages) return;
            const lastPage = infiniteQueryResult?.rawData?.pages[infiniteQueryResult.rawData.pages.length -1];
            if(lastPage.page - 1 < newPaginationModel.page){
                console.log('fetch next page', infiniteQueryResult?.hasNextPage)
                if(!infiniteQueryResult?.hasNextPage) return;
                infiniteQueryResult.fetchNextPage();
            }
  }, [infiniteQueryResult]);
     
    const tableMeta = useMemo(() => {
        if(!infiniteQueryResult?.rawData?.pages) {
            return {
                totalRows: data.length,
                paginationModel: model
            }
        } else {

               const raw: TransformedUseQueryResult<T>['rawData'] = infiniteQueryResult?.rawData;
        const totalRows = raw?.pages[0]?.total || 0;
           const lastPage = raw?.pages[raw?.pages.length -1];


           return {
            totalRows,
            paginationModel: {
                page: lastPage.page - 1,
                pageSize: model.pageSize
            }
           }
        }
    }, [data, infiniteQueryResult, model]);

     


    return (
        <DataGrid rowCount={tableMeta.totalRows} rows={rows} columns={columns} paginationModel={tableMeta.paginationModel} paginationMeta={{
            hasNextPage: infiniteQueryResult?.hasNextPage || false,
        }} paginationMode="server" onPaginationModelChange={handlePaginationModelChange} loading={!!(infiniteQueryResult?.isLoading || infiniteQueryResult?.isFetching || infiniteQueryResult?.isFetchingNextPage)} 
        onRowClick={(params)  => onRowClick?.(params.row as T)}
        />
    )
}