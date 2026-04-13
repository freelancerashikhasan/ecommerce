<?php

namespace App\DataTables;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class OrderDataTable extends DataTable
{
    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->addColumn('id', function ($row) {
                return $row->id;
            })
            ->addColumn('order_number', function ($row) {
                return '<a href="' . route('admin.orders.show', $row->id) . '">' . $row->order_number . '</a>';
            })
            ->addColumn('customer', function ($row) {
                return '<strong>' . $row->customer_name . '</strong><br><small>' . $row->customer_phone . '</small>';
            })
            ->addColumn('total', function ($row) {
                return number_format($row->total, 2) . ' BDT';
            })
            ->addColumn('order_status', function ($row) {
                $statusColors = [
                    'pending' => 'warning',
                    'processing' => 'info',
                    'confirmed' => 'primary',
                    'shipped' => 'info',
                    'delivered' => 'success',
                    'cancelled' => 'danger',
                    'returned' => 'secondary'
                ];
                $color = $statusColors[$row->order_status] ?? 'secondary';
                return '<span class="badge bg-' . $color . '">' . ucfirst($row->order_status) . '</span>';
            })
            ->addColumn('payment_status', function ($row) {
                $statusColors = [
                    'pending' => 'warning',
                    'paid' => 'success',
                    'failed' => 'danger',
                    'refunded' => 'info'
                ];
                $color = $statusColors[$row->payment_status] ?? 'secondary';
                return '<span class="badge bg-' . $color . '">' . ucfirst($row->payment_status) . '</span>';
            })
            ->addColumn('courier', function ($row) {
                if ($row->courier_type) {
                    return '<span class="badge bg-dark">' . ucfirst($row->courier_type) . '</span><br><small>' . ($row->courier_consignment_id ?? 'No ID') . '</small>';
                }
                return '<span class="badge bg-secondary">Not assigned</span>';
            })
            ->addColumn('order_count', function ($row) {
                $count = Order::where('customer_phone', $row->customer_phone)->count();
                return '<span class="badge bg-info">' . $count . ' orders</span>';
            })
            ->addColumn('conversations_count', function ($row) {
                $count = count($row->conversations ?? []);
                return $count > 0 ? '<span class="badge bg-primary">' . $count . '</span>' : '-';
            })
            ->addColumn('order_date', function ($row) {
                return $row->order_date->format('d M Y, h:i A');
            })
            ->addColumn('action', function ($row) {
                $actions = '';
                
                if (auth('admin')->user()->canAny(['access-all', 'order-view'])) {
                    $actions .= '<a href="' . route('admin.orders.show', $row->id) . '" class="me-8" title="View">
                        <i class="ri-eye-line hp-text-color-dark-0 ri-2x"></i>
                    </a>';
                }
                
                if (auth('admin')->user()->canAny(['access-all', 'order-edit'])) {
                    $actions .= '<a href="javascript:;" onclick="edit(' . $row->id . ')" class="me-8" title="Edit">
                        <i class="ri-edit-line hp-text-color-dark-0 ri-2x"></i>
                    </a>';
                }
                
                if (auth('admin')->user()->canAny(['access-all', 'order-invoice'])) {
                    $actions .= '<a href="' . route('admin.orders.invoice', $row->id) . '" target="_blank" class="me-8" title="Invoice">
                        <i class="ri-printer-line hp-text-color-dark-0 ri-2x"></i>
                    </a>';
                }
                
                if (auth('admin')->user()->canAny(['access-all', 'order-delete'])) {
                    $actions .= '<a href="javascript:void(0);" onclick="destroy(' . $row->id . ')" title="Delete">
                        <i class="ri-delete-bin-line hp-text-color-dark-0 ri-2x"></i>
                    </a>';
                }
                
                return $actions;
            })
            ->rawColumns(['order_number', 'customer', 'order_status', 'payment_status', 'courier', 'order_count', 'conversations_count', 'action'])
            ->setRowId('id');
    }

    public function query(Order $model): QueryBuilder
    {
        return $model->newQuery();
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('orders-table')
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
            Column::make('order_number')->title('Order #')->width(150),
            Column::make('customer')->title('Customer')->width(200),
            Column::make('total')->title('Total')->width(100),
            Column::make('order_status')->title('Status')->width(100),
            Column::make('payment_status')->title('Payment')->width(100),
            Column::make('courier')->title('Courier')->width(150),
            Column::make('order_count')->title('Orders')->width(80),
            Column::make('conversations_count')->title('Conv')->width(60),
            Column::make('order_date')->title('Date')->width(150),
            Column::computed('action')
                ->exportable(false)
                ->printable(false)
                ->width(150)
                ->addClass('text-center'),
        ];
    }

    protected function filename(): string
    {
        return 'Orders_' . date('YmdHis');
    }
}