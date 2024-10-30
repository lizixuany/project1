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
        
        // 获取相应账号的数据
        $id = $data['id'];
            
        // 获取传入的班级信息
        $user = User::get($id);
        if (is_null($user)) {
            return $this->error('系统未找到ID为' . $id . '的记录');
        }

        // 验证旧密码
        if ($data['oldPassword'] !== $user['password']) {
            return json(['error' => '旧密码不正确'], 401);
        }

        $user->password = $data['newPassword'];
        $user->save();

        return json(['status' => 'success', 'message' => 'Password changed successfully']);  
    }

    public function getById() {
        $request = Request::instance()->getContent();
        $data = json_decode($request, true);

        $user = User::get($data);

        return json($user);
    }

}