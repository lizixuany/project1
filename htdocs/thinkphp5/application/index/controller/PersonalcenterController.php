<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\User;

class PersonalcenterController extends Controller
{
    public function index() {
        try {
            $userId = session('x-auth-token'); 
            
            // 如果session值不存在，则设置一个默认值
            if (empty($userId)) {
                $userId = 'default_x-auth-token';
            }
           
            // 获取 POST 请求的数据
            $request =  Request::instance()->getContent();
            $data = json_decode($request, true);
            
            $username = $data['username'];
            $password = $data['password'];

            // 模拟从数据库中获取用户数据
            $user = User::with('clazz')->where('username', $username)->find();
            
            // 验证用户是否存在及密码是否正确
            if ($user && $password == $user->password) {
                // 登录成功，设置会话
                $token = md5(uniqid(mt_rand(), true));
                $userObject = json_encode($user);
                session($token, $userObject);
                header('x-auth-token:' . $token);
                return json($user);
            }                     
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }
}
