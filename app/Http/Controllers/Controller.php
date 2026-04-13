<?php
// app/Http/Controllers/Controller.php or create a BaseController

namespace App\Http\Controllers;

use App\Models\Collection;
use Inertia\Inertia;

abstract class Controller
{
    /**
     * Share collections data with all Inertia views
     */
    protected function shareCollectionsData()
    {
        $collections = Collection::active()
            ->ordered()
            ->select('id', 'name', 'slug', 'type')
            ->limit(10)
            ->get();

        Inertia::share('headerCollections', $collections);
    }
}