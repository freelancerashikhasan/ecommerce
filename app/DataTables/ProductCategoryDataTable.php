<?php
namespace App\DataTables;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class ProductCategoryDataTable extends DataTable
{
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('id', function ($row) {
                return $row->id;
            })
            ->addColumn('image', function ($row) {
                if ($row->image) {
                    return '<img src="' . asset('storage/' . $row->image) . '" width="40" height="40" style="object-fit: cover;">';
                }
                return '-';
            })
            ->addColumn('name', function ($row) {
                return $row->name;
            })
            ->addColumn('products_count', function ($row) {
                return $row->products()->count();
            })
            ->addColumn('status', function ($row) {
                $checked = $row->status ? 'checked' : '';
                return '<div class="form-check form-switch">
                    <input class="form-check-input toggle-status" type="checkbox" role="switch" 
                        data-id="' . $row->id . '" ' . $checked . '>
                </div>';
            })
            ->addColumn('action', function ($row) {
                return '
                    <div class="d-flex gap-8">
                        <a href="javascript:;" onclick="edit(' . $row->id . ')" class="btn btn-sm btn-soft-primary">
                            <i class="ri-edit-line"></i>
                        </a>
                        <a href="javascript:void(0);" onclick="destroy(' . $row->id . ')" class="btn btn-sm btn-soft-danger">
                            <i class="ri-delete-bin-line"></i>
                        </a>
                    </div>
                ';
            })
            ->rawColumns(['image', 'status', 'action'])
            ->setRowId('id');
    }

    public function query(ProductCategory $model): QueryBuilder
    {
        return $model->newQuery();
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('category-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(1)
            ->selectStyleSingle()
            ->buttons([
                Button::make('excel'),
                Button::make('csv'),
                Button::make('pdf'),
                Button::make('print'),
            ]);
    }

    public function getColumns(): array
    {
        return [
            Column::make('id')->title('ID'),
            Column::make('image')->title('Image')->orderable(false)->searchable(false),
            Column::make('name')->title('Name'),
            Column::make('products_count')->title('Products')->orderable(false),
            Column::make('status')->title('Status'),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(100)
                ->addClass('text-center'),
        ];
    }

    protected function filename(): string
    {
        return 'Categories_' . date('YmdHis');
    }
}