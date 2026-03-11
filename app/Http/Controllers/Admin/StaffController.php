<?php

namespace App\Http\Controllers\Admin;

use App\DataTables\StaffsDataTable;
use App\Helpers\FileManager;
use App\Helpers\Traits\DeleteLogTrait;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StaffRequest;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(StaffsDataTable $dataTable)
    {
        $pageTitle = "Staff List";
        return $dataTable->render('admin.staff.index', compact('pageTitle'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $pageTitle = 'Create Staff';
        return view('admin.staff.create', compact('pageTitle'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StaffRequest $request)
    {
        // Upload staff profile picture


        $staff = new Admin($request->all());
        if ($request->username == null) {
            $generateUsername = explode('-', Str::slug($request->name));
            $username = $generateUsername[0] . date('his');
            $staff->username = $username;
        } else {
            $staff->username = $request->username;
        }
        $staff->show_password = $request->username ?? $username;
        $staff->password = Hash::make($request->username ?? $username);
        $staff->save();

        return redirect()->route('admin.staff.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $pageTitle = 'Edit Staff';
        $staff = Admin::findOrFail($id);
        return view('admin.staff.create', compact('pageTitle', 'staff'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StaffRequest $request, string $id)
    {

        $staff = Admin::findOrFail($id);
        $staff->update($request->except('_token', '_method')); // user is also can be staff
        $staff->username = $staff->username; // set image name into staff image field
        $staff->save();

        return redirect()->route('staff.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Admin::findOrFail($id);
        $user->delete();

        return redirect()->back();
    }

    public function assignRole($staffId)
    {
        $staff = Admin::find(($staffId));
        $pageTitle = "Assigning Role to " . "(" . $staff->name . ")";
        $roles = Role::where('guard_name', 'admin')->get();
        return view('admin.staff.role-permissions.assign-role', compact('staff', 'roles', 'pageTitle'));
    }

    public function saveAssignedRole(Request $request, $staffId)
    {
        $staff = Admin::find($staffId);
        $permissions = [];
        if ($request->role != null) {
            foreach ($request->role as $role) {
                $singleRole = Role::where('name', $role)->first();
                foreach ($singleRole->permissions as $permission) {
                    $permissions[] = $permission->name;
                }
            }
        }
        $staff->syncPermissions($permissions);
        $staff->syncRoles($request->role);
        return redirect()->route('staff.index');
    }

    public function assignPermission($staffId)
    {
        $staff = Admin::find(($staffId));
        $pageTitle = "Assigning Permission to " . "(" . $staff->name . ")";
        $permissions = Permission::where('guard_name', 'admin')->get();

        return view('admin.staff.role-permissions.assign-permissions', compact('staff', 'permissions', 'pageTitle'));
    }

    public function saveAssignedPermission(Request $request, $staffId)
    {
        $staff = Admin::find($staffId);
        $permissions = $request->permissions ?? [];
        $staff->syncPermissions($permissions);
        return redirect()->route('admin.staff.index');
    }
}
