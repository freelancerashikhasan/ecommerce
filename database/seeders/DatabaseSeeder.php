<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create categories
         $this->call(AdminSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(RoleHasPermissionSeeder::class);
        $this->call(ModelHasRoleSeeder::class);
        $this->call(SiteSettingsSeeder::class);
        // $this->call(SiteKeywordSeeder::class);
    }
}