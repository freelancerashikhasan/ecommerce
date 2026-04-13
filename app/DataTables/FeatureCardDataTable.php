<?php
// app/DataTables/FeatureCardDataTable.php

namespace App\DataTables;

use App\Models\FeatureCard;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class FeatureCardDataTable extends DataTable
{
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('id', function ($row) {
                return $row->id;
            })
            ->addColumn('icon', function ($row) {
                if ($row->icon) {
                    if (strpos($row->icon, 'fa-') !== false) {
                        return '<i class="' . $row->icon . ' fa-2x" style="color: #634C9F;"></i>';
                    } else {
                        return '<img src="' . asset($row->icon) . '" alt="icon" style="width: 40px; height: 40px;">';
                    }
                }
                return '<i class="fas fa-star fa-2x text-muted"></i>';
            })
            ->addColumn('title', function ($row) {
                return $row->title;
            })
            ->addColumn('description', function ($row) {
                return strlen($row->description) > 50 ? substr($row->description, 0, 50) . '...' : $row->description;
            })
            ->addColumn('order', function ($row) {
                return $row->order;
            })
            ->addColumn('status', function ($row) {
                if ($row->is_active) {
                    return '<span class="badge bg-success">Active</span>';
                }
                return '<span class="badge bg-danger">Inactive</span>';
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
            ->rawColumns(['icon', 'status', 'action'])
            ->setRowId('id');
    }

    public function query(FeatureCard $model): QueryBuilder
    {
        return $model->newQuery();
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('featurecard-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(4, 'asc')
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
            Column::make('icon')->title('Icon')->width(80),
            Column::make('title')->title('Title'),
            Column::make('description')->title('Description'),
            Column::make('order')->title('Order')->width(80),
            Column::make('status')->title('Status')->width(100),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(100)
                ->addClass('text-center'),
        ];
    }

    protected function filename(): string
    {
        return 'FeatureCard_' . date('YmdHis');
    }
}