<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class RequestController extends Controller
{
    // public $acctivityType = ['Account','Role','Activity','Distributor','Warehouse','Customer','Product','Promotion'];
    // public $activityName (){         
    // };
    public function makeActivityContent($activityName,Request $request = null){
        if($request != null){
            $input = $request->all();
            $content = "";
            foreach($input as $key => $value){
                $content .= str_replace("_","",$key). " = " .$value . ",";
            }       
            return $this->getActivityContentByActivityName($activityName,$content);
        }else{
            return $this->getActivityContentByActivityName($activityName);
        }
        
    }
    
    public function getActivityContentByActivityName($activityName, $content = null){
        switch ($activityName){
            //Account content
            case "Account Updated" : return ' has just updated new information(' . $content . ') for account ';break;
            case "Account Reset Password" : return ' has just reset password for account ';break;
            case "Account Created" : return ' has just created new account ' ;break;
            case "Account Deleted" : return ' has just deleted account ' ;break;
            
            //Warehouse content
            case "Warehouse Updated" : return ' has just updated new information(' . $content . ') for warehouse ';break;           
            case "Warehouse Created" : return ' has just created new warehouse ' ;break;
            case "Warehouse Deleted" : return ' has just deleted warehouse ' ;break;

            //Distributor content
            case "Distributor Updated" : return ' has just updated new information(' . $content . ') for distributor ';break;           
            case "Distributor Created" : return ' has just created new distributor ' ;break;
            case "Distributor Deleted" : return ' has just deleted distributor ' ;break;

            //Role content
            case "Role Updated" : return ' has just updated new information(' . $content . ') for role ';break;           
            case "Role Created" : return ' has just created new role ' ;break;
            case "Role Deleted" : return ' has just deleted role ' ;break;

            //Customer content
            case "Customer Created" : return ' has just created new customer ' ;break;
            case "Customer Updated" : return ' has just updated new infomation(' . $content . ') for customer ' ;break;
            case "Customer Deleted" : return ' has just deleted customer ' ;break;

            //Promotion Type content
            case "Promotion Type Created" : return ' has just created new poromotion type ' ;break;
            case "Promotion Type Updated" : return ' has just updated new infomation(' . $content . ') for poromotion type ' ;break;
            case "Promotion Type Deleted" : return ' has just deleted poromotion type ' ;break;
            
            //Promotion Type content
            case "Promotion Created" : return ' has just created new poromotion ' ;break;
            case "Promotion Updated" : return ' has just updated new infomation(' . $content . ') for poromotion ' ;break;
            case "Promotion Deleted" : return ' has just deleted poromotion ' ;break;
            
            //default
            default: return "No content!";
        }
    }

    public function makeActivityRequest($activityName,$activityType,$activityContent,$accountId,$username)
    {       
        $request = new Request([
            'activity_id' => 'AH'.Carbon::now()->format('dmyhis'),
            'activity_name' => $activityName,
            'activity_type' => $activityType,
            'activity_content' => $activityContent,
            'account_id' => $accountId,
            'username' => $username,
        ]);
        return $request;
    }

    
}
