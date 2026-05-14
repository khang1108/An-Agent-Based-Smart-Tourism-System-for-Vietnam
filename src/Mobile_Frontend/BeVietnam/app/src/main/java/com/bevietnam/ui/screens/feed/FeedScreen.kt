package com.bevietnam.ui.screens.feed

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.bevietnam.core.model.FeedItem
import com.bevietnam.ui.components.ErrorView
import com.bevietnam.ui.components.FeedCard
import com.bevietnam.ui.components.LoadingIndicator
import com.bevietnam.ui.theme.BeVietnamTheme

@Composable
fun FeedScreen(
    viewModel: FeedViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    FeedScreenContent(
        uiState = uiState,
        onRetry = viewModel::loadFeed,
        onLikeClick = viewModel::onLikeClick
    )
}

@Composable
fun FeedScreenContent(
    uiState: FeedUiState,
    onRetry: () -> Unit,
    onLikeClick: (String) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFFFAF5E4)
    ) {
        when {
            uiState.isLoading -> LoadingIndicator()
            uiState.errorMessage != null -> ErrorView(
                message = uiState.errorMessage!!,
                onRetry = onRetry
            )
            uiState.feedItems.isEmpty() && !uiState.isLoading -> FeedEmptyState()
            else -> {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(uiState.feedItems) { item ->
                        FeedCard(
                            feedItem = item,
                            onLikeClick = { onLikeClick(item.id) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun FeedEmptyState() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "📭", fontSize = 64.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Chưa có bài đăng nào",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Preview(showBackground = true)
@Composable
fun FeedScreenPreview() {
    val mockFeedItems = listOf(
        FeedItem(
            id = "1",
            userId = "u1",
            userName = "Sơn Tùng M-TP",
            userAvatarUrl = "",
            content = "Vừa ghé thăm Vịnh Hạ Long, vẻ đẹp thật hùng vĩ! 🌊",
            imageUrl = null,
            timestamp = "2 giờ trước",
            likesCount = 1250,
            commentsCount = 45,
            location = "Quảng Ninh"
        ),
        FeedItem(
            id = "2",
            userId = "u2",
            userName = "H'Hen Niê",
            userAvatarUrl = "",
            content = "Bún đậu mắm tôm Hà Nội luôn là chân ái.",
            imageUrl = null,
            timestamp = "5 giờ trước",
            likesCount = 890,
            commentsCount = 120,
            location = "Hà Nội"
        )
    )
    BeVietnamTheme {
        FeedScreenContent(
            uiState = FeedUiState(feedItems = mockFeedItems),
            onRetry = {},
            onLikeClick = {}
        )
    }
}
