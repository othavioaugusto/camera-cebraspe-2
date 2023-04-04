package com.cameracebraspe;

import android.os.StatFs;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import android.util.Log;

import android.content.res.Configuration;
import android.content.res.Resources;
import android.util.DisplayMetrics;
import android.app.Activity;

import android.content.Context;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.params.StreamConfigurationMap;

import android.hardware.Camera;
 
public class CameraCebraspeModule extends ReactContextBaseJavaModule {

    private static final String TAG = "CameraCebraspeModule";
 
    public CameraCebraspeModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }
 
    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() { 
        return "CameraCebraspeModule";
    }
 
    @ReactMethod
    public void sayHi(Callback errorCallback, Callback successCallback) {
        try {
            System.out.println("Cumprimentos from Java");
            successCallback.invoke("Callback : Cumprimentos from Java");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Get external (SDCARD) free space
    @ReactMethod
    public void getFreeExternalMemoryAsync(Callback errorCallback, Callback successCallback, String folder) {
        try {
            // File[] folders = getCurrentActivity().getExternalCacheDirs();
            System.out.println("File folder Async: " + folder);
            long retorno = getFreeMemory(new File(folder));            
            successCallback.invoke(String.valueOf(retorno));
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Get external (SDCARD) free space
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getFreeExternalMemorySync(String folder) {       
        System.out.println("File folder Sync: " + folder);
        long retorno = getFreeMemory(new File(folder));            
        return String.valueOf(retorno);
        // return retorno.;
    }

    // Get free space for provided path
    // Note that this will throw IllegalArgumentException for invalid paths
    private long getFreeMemory(File path)
    {
        // Calcula o retorno em Bytes
        // 20000000 = 20 MB
        StatFs stats = new StatFs(path.getAbsolutePath());
        return stats.getAvailableBlocksLong() * stats.getBlockSizeLong();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getDimensoesTela() {
        System.out.println("=> Cheguei em getDimensoesTela <=");

        final Activity activity = getCurrentActivity();

        System.out.println("-> HEIGHT: " + activity.getWindow().getDecorView().getHeight());
        
        Resources r = Resources.getSystem();
        Configuration config = r.getConfiguration();

        System.out.println("-> ORIEN. LAND.: " + config.orientation);
        
        DisplayMetrics displayMetrics = new DisplayMetrics();
        activity.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        int height = displayMetrics.heightPixels;
        int width = displayMetrics.widthPixels;
        
        int rotation =  activity.getWindowManager().getDefaultDisplay().getRotation();

        return "=> Cheguei em getDimensoesTela: " + activity.getWindow().getDecorView().getHeight() + " - " + config.orientation + " - " + rotation;
    }
    

    @ReactMethod(isBlockingSynchronousMethod = true)
    // https://stackoverflow.com/questions/50132764/getting-the-path-to-sd-card/50211328
    // public void getSDCardPathCameraCebraspe(Callback errorCallback, Callback successCallback) {
    public String getSDCardPathCameraCebraspe() {    
        File[] folders = getCurrentActivity().getExternalCacheDirs();
        // try {
        //     System.out.println("SDCard getSDCardPathCameraCebraspe: " + folders[0] + " - " + folders[1]);
        //     successCallback.invoke(folders[1].toString());
        // } catch (IllegalViewOperationException e) {
        //     errorCallback.invoke(e.getMessage());
        // }
        return folders[1].toString();

    }

    @ReactMethod
    public void viewDadosCamera(Callback errorCallback, Callback successCallback) {
    
        JSONObject mapaRetorno = new JSONObject();
        // ArrayList<String> linhas = new ArrayList<String>();

        StringBuilder builder = new StringBuilder();

        try {
            // Se trouxer alguma coisa eh pq achou o Erro            
            // String command = String.format("logcat -t 200 com.camcebraspe:D *:W");
            // String[] command = { "/bin/sh", "-c", "logcat -t 200 com.camcebraspe:D *:W | grep 'CameraSource: Timed out waiting for incoming camera video frames: 0 us'" };
            // String[] command = { "/bin/sh", "-c", "logcat -t 200 com.camcebraspe:D *:W | grep '2S:'" };

            // ISSO NÃO PEGA PQ SOH CONSEGUE LER O LOG DO PROPRIO APP
            // String[] command = { "/bin/sh", "-c", "logcat -t 200 com.camcebraspe:D *:W | grep 'CameraSource: Timed out waiting for incoming camera video frames: 0 us'" };
            String[] command = { "/bin/sh", "-c", "logcat -t 200" };

            Process process = Runtime.getRuntime().exec(command);

            BufferedReader bufferedReader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            mapaRetorno.put("achou", false);

            String line;
            String linha = "";
            while ((line = bufferedReader.readLine()) != null) {                
                // mapaRetorno.put("achou", true);
                linha += " ||| " + line;
                mapaRetorno.put("linha", linha);
                // mapaRetorno.put("linha", line);
                // linhas.add(line.toString());
                // break;
            }

        } catch (Exception ex) {
            Log.e(TAG, "getLog failed", ex);
            errorCallback.invoke(String.valueOf(ex));
        }

        successCallback.invoke(mapaRetorno.toString());
        
    }


    @ReactMethod(isBlockingSynchronousMethod = true)
    public String copyFileToExternalFolder(String nomeArqVideoInterno, String novoNomeArqVideoExterno)  throws IOException {
        File src = new File(nomeArqVideoInterno);
        File dst = new File(novoNomeArqVideoExterno);

        System.out.println("-> IN: COPYFILEToExternalFOLDER: - " + nomeArqVideoInterno + " - " + novoNomeArqVideoExterno);

        InputStream in = new FileInputStream(src);
        try {
            OutputStream out = new FileOutputStream(dst);
            try {
                // Transfer bytes from in to out
                byte[] buf = new byte[1024];
                int len;
                while ((len = in.read(buf)) > 0) {
                    out.write(buf, 0, len);
                }
            } finally {
                out.close();
            }
        } finally {
            in.close();
        }

        return "-> OUT: COPYFILEToExternalFOLDER: - " + nomeArqVideoInterno + " - " + novoNomeArqVideoExterno;
    }

}