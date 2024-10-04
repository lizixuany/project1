<?php
use think\Route;

Route::group('api', function () {
    Route::get('school', 'index/SchoolController/getList');
    Route::post('school', 'index/SchoolController/add');

    // 编辑
    Route::get('school/edit', 'index/SchoolController/edit');
    Route::put('school/update', 'index/SchoolController/update');
    Route::delete('school/:school_id', 'index/SchoolController/delete');
});
