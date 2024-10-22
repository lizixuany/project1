<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\User;

class ChangepasswordController extends Controller
{
    public function index() {
        $request = Request::instance()->getContent();
        $data = json_decode($request, true);
        var_dump($data);
        var_dump($data['newPassword']);
        var_dump($data['oldPassword']);
        die();

        // 验证旧密码
        if (!$this->verifyOldPassword($oldPassword)) {
            return json(['status' => 'error', 'message' => 'Old password is incorrect']);
        }

        // 验证新密码是否符合要求
        if ($newPassword !== $confirmNewPassword) {
            return json(['status' => 'error', 'message' => 'Passwords do not match']);
        }

        // 更新密码
        if ($this->updatePassword($newPassword)) {
            return json(['status' => 'success', 'message' => 'Password changed successfully']);
        } else {
            return json(['status' => 'error', 'message' => 'Failed to change password']);
        }
    }

    public function getById() {
        $request = Request::instance()->getContent();
        $data = json_decode($request, true);

        $user = User::get($data);

        return json($user);
    }

    // 验证旧密码
    private function verifyOldPassword($oldPassword) {
        // 这里应该有逻辑来验证旧密码是否正确
    }

    // 更新密码
    private function updatePassword($newPassword) {
        // 这里应该有逻辑来更新密码
    }
}