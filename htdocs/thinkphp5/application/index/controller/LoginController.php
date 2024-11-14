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
            $request = Request::instance();
            $info = $request->header();
        
            // 获取 POST 请求的数据
            $request =  Request::instance()->getContent();
            $data = json_decode($request, true);

            $username = $data['username'];
            $password = $data['password'];
            
            // 获取相应账号的数据
            $user = User::with('clazz')
                    ->where('username', $username)
                    ->find();

            // 验证用户是否存在
            if ($user) {
                // 验证用户状态
                if ($user['state'] !== 2) {
                    // 验证用户密码是否正确
                    if ($password == $user->password) {
                        $token = md5(uniqid(mt_rand(), true));
                        $userObject = json_encode($user);
                        session($token, $userObject);
                        header('x-auth-token:' . $token);
                        return json($user);
                    } else {
                        return json(['error' => '密码不正确'], 401);
                    }
                } 
                return json(['error' => '用户已冻结'], 401);
            }
            return json(['error' => '用户不存在'], 401);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    public function logout() {
        // 清除所有会话数据
        session(null);
        return json(['status' => 'success', 'message' => 'logout successfully']);
    }

    public function currentUser(){
        $token = request()->header('x-auth-token');
        
        $userObject = session($token);
        if ($userObject) {
            $user = json_decode($userObject, true);
            return json($user);
        } else {
            return json(['error' => '无效的token'], 401);
        }
    }

    public function getRole(){
        $token = request()->header('x-auth-token');
        
        $userObject = session($token);
        if ($userObject) {
            $user = json_decode($userObject, true);
            
            if ($user['role'] === 3) {
                return 0;
            }
            return 1;
        } else {
            return json(['error' => '无效的token'], 401);
        }
    }

    private function validateToken($token){
        // 验证token的逻辑
        if (empty($token)) {
            return json(['error' => 'Token not provided'], 401);
        }
        if ($token !== $this->xAuthToken) {
            return json(['error' => 'Token error'], 401);
        }
        return true;
    }
}
