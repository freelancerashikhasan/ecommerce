<?php
namespace App\DataTables;

use App\Models\FeaturedProduct;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class FeaturedProductDataTable extends DataTable
{
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('id', function ($row) {
                return $row->id;
            })
            ->addColumn('product', function ($row) {
                return $row->product->name ?? '-';
            })
            ->addColumn('image', function ($row) {
                if ($row->product && $row->product->featured_image) {
                    return '<img src="' . asset('storage/' . $row->product->featured_image) . '" width="40" height="40" style="object-fit: cover;">';
                }
                return '-';
            })
            ->addColumn('type', function ($row) {
                $badges = [
                    'featured' => 'primary',
                    'new_arrival' => 'success',
                    'today_deal' => 'warning',
                    'best_seller' => 'info'
                ];
                $badge = $badges[$row->type] ?? 'secondary';
                return '<span class="badge bg-' . $badge . '">' . str_replace('_', ' ', ucfirst($row->type)) . '</span>';
            })
            ->addColumn('discount', function ($row) {
                if ($row->discount_percentage) {
                    return $row->discount_percentage . '%';
                }
                if ($row->discount_amount) {
                    return '$' . number_format($row->discount_amount, 2);
                }
                return '-';
            })
            ->addColumn('duration', function ($row) {
                $html = '<div class="small">';
                if ($row->start_date) {
                    $html .= 'From: ' . $row->start_date->format('M d, Y') . '<br>';
                }
                if ($row->end_date) {
                    $html .= 'To: ' . $row->end_date->format('M d, Y');
                }
                if (!$row->start_date && !$row->end_date) {
                    $html .= 'No time limit';
                }
                $html .= '</div>';
                return $html;
            })
            ->addColumn('status', function ($row) {
                $now = now();
                $isValid = $row->status && 
                          (!$row->start_date || $row->start_date <= $now) &&
                          (!$row->end_date || $row->end_date >= $now);
                
                $badge = $isValid ? 'success' : 'danger';
                $text = $isValid ? 'Active' : 'Inactive';
                
                return '<span class="badge bg-' . $badge . '">' . $text . '</span>';
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
            ->rawColumns(['image', 'type', 'duration', 'status', 'action'])
            ->setRowId('id');
    }

    public function query(FeaturedProduct $model): QueryBuilder
    {
        return $model->newQuery()->with('product');
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('featured-table')
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
            Column::make('product')->title('Product'),
            Column::make('type')->title('Type'),
            Column::make('discount')->title('Discount'),
            Column::make('duration')->title('Duration'),
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
        return 'Featured_Products_' . date('YmdHis');
    }
}