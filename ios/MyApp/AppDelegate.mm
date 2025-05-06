#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#include "char_traits_fix.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PawPal";//MyApp
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
 // return [NSURL URLWithString:@"http://169.254.103.18:8081/index.bundle?platform=ios"];
  return [NSURL URLWithString:@"http://169.254.92.46:8081/index.bundle?platform=ios"];
 // return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  //return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  /*
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif*/
}

@end
