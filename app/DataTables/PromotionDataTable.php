<?php
// app/DataTables/PromotionDataTable.php

namespace App\DataTables;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class PromotionDataTable extends DataTable
{
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('id', function ($row) {
                return $row->id;
            })
            ->addColumn('image', function ($row) {
                if ($row->image) {
                    return '<img src="' . asset('storage/' . $row->image) . '" alt="image" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">';
                }
                return '<span class="text-muted">No Image</span>';
            })
            ->addColumn('title', function ($row) {
                return strlen($row->title) > 40 ? substr($row->title, 0, 40) . '...' : $row->title;
            })
            ->addColumn('type', function ($row) {
                $badges = [
                    'slider' => 'primary',
                    'feature_card' => 'info',
                    'feature_product' => 'success'
                ];
                $color = $badges[$row->type] ?? 'secondary';
                return '<span class="badge bg-' . $color . '">' . ucfirst(str_replace('_', ' ', $row->type)) . '</span>';
            })
            ->addColumn('position', function ($row) {
                return ucfirst($row->position);
            })
            ->addColumn('status', function ($row) {
                if ($row->is_active) {
                    return '<span class="badge bg-success">Active</span>';
                }
                return '<span class="badge bg-danger">Inactive</span>';
            })
            ->addColumn('dates', function ($row) {
                $html = '';
                if ($row->start_date) {
                    $html .= '<small>Start: ' . $row->start_date->format('d M Y') . '</small><br>';
                }
                if ($row->end_date) {
                    $html .= '<small>End: ' . $row->end_date->format('d M Y') . '</small>';
                }
                return $html ?: '<span class="text-muted">Always Active</span>';
            })
            ->addColumn('action', function ($row) {
                return '
                    <a href="javascript:;" onclick="edit(' . $row->id . ')" class="me-8" title="Edit">
                        <i class="ri-edit-line hp-text-color-dark-0 ri-2x"></i>
                    </a>
                    <a href="javascript:void(0);" onclick="destroy(' . $row->id . ')" title="Delete">
                        <i class="ri-delete-bin-line hp-text-color-dark-0 ri-2x"></i>
                    </a>
                ';
            })
            ->rawColumns(['image', 'type', 'status', 'action'])
            ->setRowId('id');
    }

    public function query(Promotion $model): QueryBuilder
    {
        return $model->newQuery();
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('promotion-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(0, 'desc')
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
            Column::make('id')->title('ID')->width(50),
            Column::make('image')->title('Image')->width(80),
            Column::make('title')->title('Title'),
            Column::make('type')->title('Type')->width(100),
            Column::make('position')->title('Position')->width(80),
            Column::make('status')->title('Status')->width(80),
            Column::make('dates')->title('Active Dates')->width(120),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(100)
                ->addClass('text-center'),
        ];
    }

    protected function filename(): string
    {
        return 'Promotion_' . date('YmdHis');
    }
}