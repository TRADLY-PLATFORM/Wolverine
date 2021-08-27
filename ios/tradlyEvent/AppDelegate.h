#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>
#import "RNFBMessagingModule.h"
#import <RNBranch/RNBranch.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
