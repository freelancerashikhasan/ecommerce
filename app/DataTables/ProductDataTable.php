<?php
namespace App\DataTables;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class ProductDataTable extends DataTable
{
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('id', function ($row) {
                return $row->id;
            })
            ->addColumn('image', function ($row) {
                if ($row->featured_image) {
                    return '<img src="' . asset('storage/' . $row->featured_image) . '" width="50" height="50" style="object-fit: cover;">';
                }
                return '<div class="bg-light d-flex align-items-center justify-content-center" style="width:50px;height:50px;">No Image</div>';
            })
            ->addColumn('name', function ($row) {
                return $row->name;
            })
            ->addColumn('price', function ($row) {
                $html = '<div>';
                if ($row->sale_price) {
                    $html .= '<span class="text-decoration-line-through text-muted">$' . number_format($row->regular_price, 2) . '</span><br>';
                    $html .= '<span class="text-danger fw-bold">$' . number_format($row->sale_price, 2) . '</span>';
                } else {
                    $html .= '<span>$' . number_format($row->regular_price, 2) . '</span>';
                }
                $html .= '</div>';
                return $html;
            })
            ->addColumn('stock', function ($row) {
                if ($row->manage_stock) {
                    $badge = $row->stock_quantity > 0 ? 'success' : 'danger';
                    return '<span class="badge bg-' . $badge . '">' . $row->stock_quantity . ' in stock</span>';
                }
                return '<span class="badge bg-info">Unlimited</span>';
            })
            ->addColumn('status', function ($row) {
                $checked = $row->status ? 'checked' : '';
                return '<div class="form-check form-switch">
                    <input class="form-check-input toggle-status" type="checkbox" role="switch" 
                        data-id="' . $row->id . '" ' . $checked . '>
                </div>';
            })
            ->addColumn('product_type', function ($row) {
                $badge = $row->product_type == 'variable' ? 'warning' : 'secondary';
                return '<span class="badge bg-' . $badge . '">' . ucfirst($row->product_type) . '</span>';
            })
            ->addColumn('action', function ($row) {
                return '
                    <div class="d-flex gap-8">
                        <a href="' . route('admin.products.edit', $row->id) . '" class="btn btn-sm btn-soft-primary">
                            <i class="ri-edit-line"></i>
                        </a>
                        <a href="javascript:void(0);" onclick="destroy(' . $row->id . ')" class="btn btn-sm btn-soft-danger">
                            <i class="ri-delete-bin-line"></i>
                        </a>
                    </div>
                ';
            })
            ->rawColumns(['image', 'price', 'stock', 'status', 'product_type', 'action'])
            ->setRowId('id');
    }

    public function query(Product $model): QueryBuilder
    {
        return $model->newQuery()->with(['categories']);
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('product-table')
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
            Column::make('price')->title('Price')->orderable(false),
            Column::make('stock')->title('Stock')->orderable(false),
            Column::make('product_type')->title('Type'),
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
        return 'Products_' . date('YmdHis');
    }
}