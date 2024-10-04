<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\User;

class LoginController extends Controller
{
    public function index() {
        try {
            session_start();

            // 获取 POST 请求的数据
            $request =  Request::instance()->getContent();
            $data = json_decode($request, true);

            $username = $data['username'];
            $password = $data['password'];
            
            // 获取相应账号的数据
            $user = User::where('username', $username)->find();

            // 验证用户是否存在及密码是否正确
            if ($user && $password == $user->password) {
                // 登录成功，设置会话
                session('user_id', $user->id);
                return json($user);
            }
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    public function logout() {
        // 清除所有会话数据
        session(null);
        return 0;
    }
}
