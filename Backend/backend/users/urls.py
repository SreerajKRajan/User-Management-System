from django.urls import path
from .views import SignupView, LoginView, UserDetailsView, AdminLoginView, AdminUserListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('user-details/', UserDetailsView.as_view(), name='user-details'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
 ]
