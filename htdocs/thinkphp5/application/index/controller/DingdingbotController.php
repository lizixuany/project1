<?php
namespace app\index\controller;
use app\common\model\Course;
use app\common\model\Term;
use app\common\model\Lesson;
use app\common\model\User;

class DingdingbotController
{
    // 钉钉机器人Webhook URL
    public $webhookUrl = 'https://oapi.dingtalk.com/robot/send?access_token=d3315548d1c9c3432086b287ce4f5196141222849c6b0bcb3280e69187c11364';

    // 请求头部
    public $headers = [
        'Content-Type: application/json',
    ];

    // 发送消息
    public function sendMessage()
    {
        $users = $this->getMessage();

        $data = $this->buildDingtalkMessage($users);;

        $options = [
            'http' => [
                'header'  => implode("\r\n", $this->headers),
                'method'  => 'POST',
                'content' => json_encode($data),
            ],
        ];

        $context  = stream_context_create($options);
        $result = file_get_contents($this->webhookUrl, false, $context);

        if ($result === FALSE) {
        
            var_dump('false');
        }
    }

    public function getMessage() {
        // 当前时间
        $now = new \DateTime();
        $now->modify('+1 day'); // 修改日期为明天
        $date = date('Y-m-d', strtotime('+1 day'));
        $weekday = date('w');
        if ($weekday === 6) {
            $weekday = 0;
        } else {
            $weekday = $weekday + 1;
        }

        $terms = $this->getTerms();
        $users = [];
        foreach ($terms as $term) {
            $startTime = new \DateTime($term->start_time);
            $endTime = new \DateTime($term->end_time);
            if ($date >= $startTime->format('Y-m-d') && $date <= $endTime->format('Y-m-d')) {
                // 计算开始时间到当前时间的天数差
                $diffInDays = floor(($now->getTimestamp() - $startTime->getTimestamp()) / (60 * 60 * 24));

                // 计算是开始时间到结束时间的第几周
                $weekNumber = ceil($diffInDays / 7);

                $courses = Course::where('term_id', $term->id)->select();
                foreach ($courses as $course) {
                    foreach (json_decode($course->week, true) as $week) {
                        if((int)$weekNumber === $week && (int)$weekday === $course->day) {
                            $lessons = Lesson::with('user')->where('course_id', $course->id)->select();
                            foreach ($lessons as $lesson) {
                                $user = $lesson->user;
                                 // 检查 $user->id 是否已经在 $users 数组中
                                if (!isset($users[$user->id])) {
                                    // 如果用户 ID 不存在，初始化一个空数组
                                    $users[$user->id] = [
                                        'name' => $user->name,
                                        'courses' => [] // 初始化课程数组
                                    ];
                                }
                                // 将课程周期添加到该用户的课程数组中
                                $users[$user->id]['courses'][] = $course->period;
                            }
                        }
                    }
                }
            }
        }
        var_dump($users);
        return $users;
    }

    protected function buildDingtalkMessage($users)
    {
        if (!$users) {
            $content = "## 明天无行程安排\n";
        } else {
            // 构建 Markdown 格式的消息内容
            $content = "## 明天的行程安排\n";
            $content .= "|               |  一  |  二  |  三  |  四  |  五  |                            \n";
            $content .= "| ----- | ----- | ----- | ----- | ----- | ----- |                         \n";
            foreach ($users as $user) {
                $userName = $user['name']; // 假设用户名字段为'name'
                $content .= "| " . $userName . " | ";
                
                for ($day = 1; $day <= 5; $day++) {
                    $classStatus = in_array($day, $user['courses']) ? ' 有 ' : ' 无 ';
                    $content .= " " . $classStatus . " |";
                }
            
                $content .= "      \n"; // 在用户信息结束后添加换行符
            }
            
            // 如果你想要在每个用户之后添加一个额外的空行
            $content .= "       \n";
        }      

        return [
            'msgtype' => 'markdown',
            'markdown' => [
                'title' => '每日行程表',
                'text' => $content
            ]
        ];
    }

    public function getTerms() {
        $terms = Term::with('school')->select();

        return $terms;
    }
}