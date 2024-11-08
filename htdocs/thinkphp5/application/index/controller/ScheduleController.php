<?php
namespace app\index\controller;
use think\Controller;
use think\Db;
use app\common\model\Course;

class ScheduleController extends Controller
{
    public function index()
    {
        $request = request()->getContent();
        $data = json_decode($request, true);

        $school_id =$data['school'];
        $clazz_id =$data['clazz'];
        $term_id =$data['term'];
        $week =$data['weekNumber'];

        $condition = [];
        if ($school_id !== null) {
            $condition['school.id'] =$school_id;
        }
        if ($clazz_id !== null) {
            $condition['clazz.id'] =$clazz_id;
        }
        if ($term_id !== null) {
            $condition['term.id'] =$term_id;
        }
        $courses = Course::with(['term', 'clazz', 'school'])
                    ->where($condition)
                    ->select();

        $result = [];
        foreach ($courses as $course) {
            $courseWeeks = json_decode($course['week'], true);
            if ($week !== null && !in_array($week, $courseWeeks)) {
                continue;
            }

            $day = $course['day'];
            $period = $course['period'];

            if (isset($course['name'])) {
            $result[] = [
                'name' => $course['name'],
                'day' => $day,
                'period' => $period,
            ];
           }
        }

        return json(['status' => 'success', 'data' => $result]);
    }
}
