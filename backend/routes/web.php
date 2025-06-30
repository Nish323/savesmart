<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ZaimController;

Route::get('/', function () {
    return view('welcome');
});

// Zaimに登録したURLと同じパスでリクエストを受け付け、APIルートにリダイレクト
Route::get('/zaim/redirect', function (Illuminate\Http\Request $request) {
    // リダイレクトではなく、直接コントローラーを呼び出す
    return app(\App\Http\Controllers\ZaimController::class)->redirect($request);
});

Route::get('/zaim/callback', function (Illuminate\Http\Request $request) {
    // リダイレクトではなく、直接コントローラーを呼び出す
    return app(\App\Http\Controllers\ZaimController::class)->callback($request);
});
