<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\NormalCategoryController;
use App\Http\Controllers\SpecialCategoryController;
use App\Http\Controllers\EmotionCategoryController;
use Illuminate\Support\Facades\Artisan;

Route::post('/tasks/run-scheduler', function (Request $request) {
    // config/app.php で定義したトークンと一致するか確認
    if ($request->bearerToken() !== config('app.scheduler_token')) {
        abort(403, 'Unauthorized');
    }

    // 'schedule:run'コマンドを実行
    Artisan::call('schedule:run');

    return response('Scheduler executed successfully.', 200);
});

Route::get('/', function () {
    return redirect('client/login');
});

// ユーザー
Route::post('/user/register', [UserController::class, 'register']);
Route::post('/user/login', [UserController::class, 'login']);

// ユーザーログインしたものしか受け付けない
Route::middleware(['auth:sanctum', 'ability:user'])->group(function () {
    Route::get('/user/check-auth', [UserController::class, 'checkAuth']);
    Route::post('/user/logout', [UserController::class, 'logout']);
    Route::get('/user/top', [UserController::class, 'showTop']);
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::get('/incomes', [IncomeController::class, 'index']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::post('/incomes', [IncomeController::class, 'store']);
    Route::get('/normal-categories', [NormalCategoryController::class, 'index']);
    Route::get('/special-categories', [SpecialCategoryController::class, 'index']);
    Route::get('/emotion-categories', [EmotionCategoryController::class, 'index']);
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update']);
    Route::put('/incomes/{income}', [IncomeController::class, 'update']);
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy']);
    Route::delete('/incomes/{income}', [IncomeController::class, 'destroy']);
    Route::get('/expenses/{expense}', [ExpenseController::class, 'show']);
    Route::get('/incomes/{income}', [IncomeController::class, 'show']);
});
